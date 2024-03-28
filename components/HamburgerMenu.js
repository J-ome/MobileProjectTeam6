import React, { useState } from "react";
import { Drawer } from 'react-native-paper'


export default HamburgerMenu = () => {
    const [active, setActive] = useState('');


    <Drawer.Section title="Some title">
        <Drawer.Item
            label="First Item"
            active={active === 'first'}
            onPress={() => setActive('first')}
        />
        <Drawer.Item
            label="Second Item"
            active={active === 'second'}
            onPress={() => setActive('second')}
        />
    </Drawer.Section>
}