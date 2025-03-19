import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    viewBg: {
        backgroundColor: "white",
    },
    viewHeader: {
        padding: 12,
    },
    viewBody: {
        flex: 1,
        paddingLeft: 18,
        paddingRight: 18
    },
    header: {
        color: "#07314A",
        fontSize: 24,
        fontWeight: "bold"
    },
    separatorHeader: {
        backgroundColor: "#EDB43B",
        height: 4,
        width: 50,
        marginTop: 4
    }
});

const PageView = (props) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.viewBg, styles.viewHeader]}>
                <Text style={styles.header}>
                    {props.header}
                </Text>
                <View style={styles.separatorHeader} />
            </SafeAreaView>
            <SafeAreaView
                {...props}
                style={[styles.viewBg, styles.viewBody]}
            />
        </SafeAreaProvider>
    );
}

export default PageView;