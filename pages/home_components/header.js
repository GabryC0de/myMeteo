import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
function Header() {
    const screenWidth = Dimensions.get('window').width;
    const width = screenWidth - 20; // Simile a calc(100% - 20)
    return (
        <View style={[styles.header, { width }]}>
            <Pressable style={styles.headerIcons} onPress={() => { console.log("Clicked ...!") }}>
                <FontAwesomeIcon icon={faEllipsisVertical} size={24} />
            </Pressable>
            <Pressable style={styles.headerIcons} onPress={() => { console.log("Clicked +!") }}>
                <FontAwesomeIcon icon={faPlus} size={24} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'flex-end',
        margin: 10,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 171, 197, 0.4)',
        padding: 3,
    },
    headerIcons: {
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        height: '100%',
        aspectRatio: '1/1',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default Header;