import {
    Text,
    View,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F6F8FA",
        borderRadius: 16,
        padding: 24,
    }
});

const FormView = (props) => {
    return (
        <View
            {...props}
            style={styles.container}
        />
    );
}

export default FormView;