import { icons } from "@/constants";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MyLocation from "./Map";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { useRef } from "react";
import { router } from "expo-router";

const RideLayout = ({title, snapPoints, children}:{ title: string,snapPoints : string[], children : React.ReactNode }) =>{
    const botttomSheetRef = useRef<BottomSheet>(null);
    return(
        <GestureHandlerRootView>
            <View className="flex-1 bg-white">
                <View className="flex flex-col h-screen bg-blue-500">
                    <View className="flex flex-row absolute z-10 top-3 items-center justify-start px-4">
                        <TouchableOpacity onPress={()=>router.back()}>
                            <View className="w-10 h-10 bg-white rounded-full justify-center items-center">
                                <Image
                                source={icons.backArrow}
                                resizeMode="contain"
                                className="w-6 h-6"
                                />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-xl ml-3 font-JakartaSemiBold">
                            {title || 'Go Back'}
                        </Text>
                    </View>
                    <MyLocation/>
                </View>
                <BottomSheet
                keyboardBehavior="extend"
                ref={botttomSheetRef}
                snapPoints={snapPoints}
                index={0}
                >
                <BottomSheetView style={{ flex:1, padding:20}}>
                    {children}
                </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}
export default RideLayout;