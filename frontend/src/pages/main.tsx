import {Image, ImageBackground, View} from 'react-native';
import CustomFont from '../../components/customFont';
import {NoCoupleMent} from '../constants/strings';

const Main = () => {
  return (
    <ImageBackground
      source={require('../../images/main.webp')}
      style={{flex: 1}}
      resizeMode="cover">
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../images/풍선들.webp')}
            resizeMode="contain"
            style={{
              width: 120,
              height: 110,
              alignSelf: 'center',
            }}
          />
          <Image
            source={require('../../images/logo.webp')}
            resizeMode="contain"
            style={{width: 284, height: 64}}
          />
        </View>
        <View style={{justifyContent: 'center', marginTop: 30}}>
          <CustomFont
            children={NoCoupleMent.ment}
            size="medium"
            style={{
              textAlign: 'center',
              fontFamily: 'Cafe24 Oneprettynight',
            }}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image
            source={require('../../images/str.webp')}
            style={{width: 292, height: 43, marginBottom: 25}}
            resizeMode="contain"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Main;
