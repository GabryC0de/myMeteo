import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
function Header() {
    // const screenWidth = Dimensions.get('window').width;
    // const width = screenWidth - 20; // Simile a calc(100% - 20)
    return (
        <View style={styles.header}>
            <Pressable style={[styles.headerIcons, { marginRight: 5 }]} onPress={() => { console.log("Clicked +!") }}>
                <FontAwesomeIcon style={styles.icons} icon={faPlus} size={20} />
            </Pressable>
            <Pressable style={[styles.headerIcons, { marginLeft: 5 }]} onPress={() => { console.log("Clicked ...!") }}>
                <FontAwesomeIcon style={styles.icons} icon={faEllipsisVertical} size={20} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center',
        justifyContent: 'flex-end',
        margin: 10,
        borderRadius: 16,
        padding: 3,
    },
    headerIcons: {

        borderRadius: 16,
        height: '100%',
        aspectRatio: '1/1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icons: {
        color: 'rgba(255, 255, 255, 0.8)'
    }
})

export default Header;