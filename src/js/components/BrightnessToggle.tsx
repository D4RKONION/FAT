import { useSelector, useDispatch } from 'react-redux'
import { setThemeBrightness } from '../actions';
import styles from '../../style/components/BrightnessToggle.module.scss'
import { IonToggle } from '@ionic/react';
import { themeBrightnessSelector } from '../selectors';

const BrightnessToggle = ({ styleName }) => {
	
	const dispatch = useDispatch();
	const themeBrightness = useSelector(themeBrightnessSelector);

	return (
		<IonToggle
			className={`${styles.brightnessToggle} ${styleName}`}
			checked={themeBrightness === "light" ? false : true}
			onIonChange={e => { e.detail.checked ? dispatch(setThemeBrightness("dark")) : dispatch(setThemeBrightness("light"))}}
			slot="end"
		/>
	)

}

export default BrightnessToggle;