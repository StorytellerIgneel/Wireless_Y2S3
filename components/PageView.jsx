import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    StyleSheet
} from 'react-native';
import {
    Text
} from '@/components';

const styles = StyleSheet.create({
    viewHeader: {
        padding: 10,
        paddingLeft: 20,
        marginTop: 10
    },
    viewBody: {
        flex: 1,
        paddingLeft: 18,
        paddingRight: 18
    },
    header: {
        fontSize: 24,
        fontWeight: "bold"
    },
    separatorHeader: {
        backgroundColor: "rgba(237, 180, 59, 1)",
        height: 4,
        width: 50,
        marginTop: 4
    }
});

const PageView = ({ style, ...props}) => {
    const backgroundColor = useThemeColor({}, 'primaryBackground');

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[{ backgroundColor }, styles.viewHeader]}>
                <Text style={styles.header}>
                    {props.header}
                </Text>
                <View style={styles.separatorHeader} />
            </SafeAreaView>
            <SafeAreaView
                {...props}
                style={[{ backgroundColor }, styles.viewBody]}
            />
        </SafeAreaProvider>
    );
}

export default PageView;