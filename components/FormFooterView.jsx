import {
    View,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container: {
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