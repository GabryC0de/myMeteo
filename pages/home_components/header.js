import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { FontAwesomeIcon } from '../../icons/icons.js'; // Importa dalla tua libreria
function Header() {
    return (
        <View style={styles.header}>
            <Pressable style={[styles.headerIcons, { marginRight: 5 }]} onPress={() => { console.log("Clicked +!") }}>
                <FontAwesomeIcon style={styles.icons} icon={'plus'} size={20} />
            </Pressable>
            <Pressable style={[styles.headerIcons, { marginLeft: 5 }]} onPress={() => { console.log("Clicked ...!") }}>
                <FontAwesomeIcon style={styles.icons} icon={'ellipsis-vertical'} size={20} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        justifyContent: 'flex-end',
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