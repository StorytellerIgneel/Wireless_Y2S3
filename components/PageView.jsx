import { useContext } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import UserContext from '@/context/UserContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef, useScrollViewOffset, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
    View,
    Image,
    Pressable,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Text from '@/components/Text.jsx';
import MenuSVG from '../assets/images/menu.svg';
import NotifSVG from '../assets/images/notification.svg';
import ArrowLeftSVG from '../assets/images/arrow_left.svg';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        zIndex: 1
    },
    viewBody: {
        flex: 1,
        paddingLeft: 18,
        paddingRight: 18,
    },
    viewHeader: {
        paddingLeft: 20,
        zIndex: 2,
    },
    header: {
        fontSize: 32,
        fontWeight: "bold",
    },
    separatorHeader: {
        backgroundColor: "rgba(237, 180, 59, 1)",
        height: 4,
        width: 50,
        marginTop: 4,
        marginLeft: 20,
        marginBottom: 20,
    },
    circle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const HEADER_HEIGHT = 63;

const PageView = ({ type, style, children, ...props}) => {
    const router = useRouter();

    const { user } = useContext(UserContext);

    const color = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'bg_primary');
    const bg_secondary = useThemeColor({}, 'bg_secondary');

    const scrollRef = useAnimatedRef();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const topBarAnimantedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: scrollOffset.value
                }
            ]
        };
    });

    const headerAnimantedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: scrollOffset.value - Math.min(HEADER_HEIGHT, scrollOffset.value)
                },
                {
                    scale: interpolate(Math.min(HEADER_HEIGHT, scrollOffset.value), [0, 0, HEADER_HEIGHT], [1, 1, 0.7])
                    
                }
            ]
        };
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[{ backgroundColor }, styles.container]}>
                <Animated.ScrollView ref={scrollRef} scrollEventThrottle={8}>
                    <Animated.View style={[{ backgroundColor }, styles.topBar, topBarAnimantedStyle]}>
                        {type == "profile" ? (
                            <>
                                <Pressable onPress={() => router.navigate() }>
                                    <MenuSVG
                                        width={30}
                                        height={30}
                                        stroke={color}
                                    />
                                </Pressable>
                                <Pressable onPress={() => router.navigate() } style={{ marginLeft: "60%" }}>
                                    <NotifSVG
                                        width={24}
                                        height={24}
                                        stroke={color}
                                    />
                                </Pressable>
                                <Pressable onPress={() => router.navigate("/profile") }>
                                    <Image
                                        source={{ uri: "https://avatar.iran.liara.run/username?username=" + (user ? user.username : "Guest") }}
                                        style={{
                                            width: 40,
                                            height: 40
                                        }}
                                    />
                                </Pressable>
                            </>
                        ) : type == "back" ? (
                            <>
                                <TouchableOpacity onPress={() => router.back() } style={[{ backgroundColor: color }, styles.circle]}>
                                    <ArrowLeftSVG
                                        width={25}
                                        height={25}
                                        stroke={bg_secondary}
                                    />
                                </TouchableOpacity>
                            </>
                        ) : undefined}
                    </Animated.View>
                    <Animated.View style={[styles.viewHeader, headerAnimantedStyle]}>
                        <Text style={styles.header}>
                            {props.header}
                        </Text>
                    </Animated.View>
                    <View style={styles.separatorHeader} />
                    <View
                        {...props}
                        style={[{ backgroundColor }, props.bodyStyle || styles.viewBody]}
                    >
                        {children}
                    </View>
                </Animated.ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default PageView;