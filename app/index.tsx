import { Redirect } from "expo-router";
import { useAuth } from '@clerk/clerk-expo';
import 'react-native-get-random-values';
const Home = ()=>{
    const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/(root)/(tabs)/home'} />
  }
    return <Redirect href="/(auth)/welcome"/>
}
export default Home;