import GoogleTextInput from "@/components/GoogleTextInput";
import MyLocation from "@/components/Map";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location"
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";

export default function Page() {
  const { setUserLocation, setDestinationLocation} = useLocationStore();
  const { user } = useUser();

  const { data : recentRides, loading } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`)
  const [hasPermission, setHasPermission] = useState(false);
  const handleSignOut = () =>{
    SignedOut();
    router.replace("/(auth)/sign-in");
  }

  const handleDestinationPress = (location: {latitude: number, longitude: number, address: string}) =>{
    setDestinationLocation(location)
    router.push('/(root)/find-rides')
  }

  useEffect(()=>{
    const requestLocation = async ()=>{
      let { status } = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted'){
        setHasPermission(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      let address = await Location.reverseGeocodeAsync({
        latitude:location.coords?.latitude!,
        longitude:location.coords?.longitude!
      })
      setUserLocation({
        latitude:location.coords.latitude,
        longitude:location.coords.longitude,
        address: `${address[0].city}, ${address[0].region}, ${address[0].country}`
      })
    };
    
    requestLocation();
  },[])
  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
      data={recentRides?.slice(0, 5)}
      renderItem={({item})=><RideCard ride={item}/>}
      className="px-5"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingBottom:80,
      }}
      ListEmptyComponent={()=>(
        <SafeAreaView className="flex py-60 flex-col justify-center items-center">
          {
            !loading ? (
              <>
              <Image
              source={images.noResult}
              className="w-40 h-40 p-20"
              alt="No recent rides"
              resizeMode="contain"
              />
              <Text className="text-sm" numberOfLines={1}>No recent rides found</Text>
              </>
            ):(
            <ActivityIndicator className="py-24" size="large" color="#000"/>
          )
          }
        </SafeAreaView>
      )}
      ListHeaderComponent={()=>(
        <>
        <View className="flex flex-row items-center justify-between my-5">
          <Text className="text-xl font-JakartaExtraBold capitalize">Welcome{", "}{user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}👋</Text>
          <TouchableOpacity onPress={handleSignOut} className="justify-center items-center w-10 h-10 rounded-full bg-white">
            <Image source={icons.out} className="w-5 h-5"/>
          </TouchableOpacity>
        </View>
        <GoogleTextInput
        icon={icons.search}
        bgColor="white"
        containerStyle="bg-white shadow-md shadow-neutral-300"
        handlePress = {handleDestinationPress}
        />
        <>
        <Text className="text-xl font-JakartaBold mb-3">Your Current Location</Text>
        <View className="flex items-center justify-center bg-transparent h-[300px]">
          <MyLocation/>
        </View>
        </>
        <Text className="text-xl font-JakartaBold mt-3 mb-3">Recent Rides</Text>
        </>
      )}
      />
    </SafeAreaView>
  );
}
