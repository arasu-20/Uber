import CustomButton from "@/components/CustomButton";
import { useSignIn } from '@clerk/clerk-expo'
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, ScrollView, Image, } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
const SignIn = ()=>{
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter()
    const [form, setForm] = useState({
        email:"",
        password:"",
    })
    const onSignInPress = useCallback(async () => {
        if (!isLoaded) return
    
        // Start the sign-in process using the email and password provided
        try {
          const signInAttempt = await signIn.create({
            identifier: form.email,
            password: form.password,
          })
    
          // If sign-in process is complete, set the created session as active
          // and redirect the user
          if (signInAttempt.status === 'complete') {
            await setActive({ session: signInAttempt.createdSessionId })
            router.replace('/')
          } else {
            // If the status isn't complete, check why. User might need to
            // complete further steps.
            console.error(JSON.stringify(signInAttempt, null, 2))
          }
        } catch (err) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(err, null, 2))
        }
      },[isLoaded, form.email, form.password])
    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image
                    source={images.signUpCar}
                    className="z-0 w-full h-[250px]"
                    />
                    <Text className="text-2xl text-black font-JakartaSemiBold bottom-5 left-5">Welcome{' '}👋</Text>
                </View>
                <View className="p-5">
                    <InputField
                    label="Email"
                    placeholder="Enter your email"
                    icon={icons.email}
                    value={form.email}
                    onChangeText={(value)=>setForm({
                        ...form,
                        email:value,
                    })}
                    /><InputField
                    label="Password"
                    placeholder="Enter your paswword"
                    icon={icons.lock}
                    secureTextEntry={true}
                    value={form.password}
                    onChangeText={(value)=>setForm({
                        ...form,
                        password:value,
                    })}
                    />
                    <CustomButton title="Sign In" onPress={onSignInPress} className="w-full bg-[#0286ff] mt-6"/>
                    <Link href="/(auth)/sign-up" className="text-lg text-center text-general-200 mt-5">
                    <Text>Don't have an Account?{' '}</Text>
                    <Text className="text-primary-500">Sign Up</Text>
                    </Link>
                </View>
            </View>
        </ScrollView>
    )
}
export default SignIn;