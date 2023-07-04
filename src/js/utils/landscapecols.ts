import { PlayerData } from '../types';

export const createCharacterDataCategoryObj = (charName: PlayerData["name"], specificCancels: number[]) => {
	return specificCancels.filter(dataRow =>
		Object.keys(dataRow).map(dataEntryKey => 
			dataRow[dataEntryKey]
		).some(dataEntry =>
			dataEntry.usedBy.includes(charName)
		)
	)
}

export const createOrderedLandscapeColsObj = (
	gameDetails: any,
	currentLandscapeCols: {[key: string]: string},
	colsToSetArray: {[key: string]: string},
	forceMode: "off" | "on" | "none",
) => {
	// duplicate the cols obj
	const keysInOrder = [];
	const currentLandscapeColsDupe = {...currentLandscapeCols}
	const newLandscapeColsInOrder = {};

	// extract the keys from the 2 data table entry files so we can order our landscape cols
	Object.keys(gameDetails.universalDataPoints).forEach(dataCategory =>
		gameDetails.universalDataPoints[dataCategory].forEach(dataRow =>
			Object.keys(dataRow).forEach(dataEntryKey =>
				keysInOrder.push(dataEntryKey)
			)
		)
	)
	gameDetails.specificCancels.forEach(dataCategory =>
		Object.keys(dataCategory).forEach(dataRow =>
			keysInOrder.push(dataCategory[dataRow].dataFileKey)
		)
	)
	
	// loop through the provided array of columns to toggle
	Object.keys(colsToSetArray).forEach(dataEntryKey => {
		if (forceMode === "off") {
			delete currentLandscapeColsDupe[dataEntryKey];
		} else if (forceMode === "on" || !currentLandscapeColsDupe[dataEntryKey]) {
			currentLandscapeColsDupe[dataEntryKey] = colsToSetArray[dataEntryKey];
		} else {
			delete currentLandscapeColsDupe[dataEntryKey];
		}
	})
	

	// call the reorder function
	keysInOrder.forEach(detailKey => {
		Object.keys(currentLandscapeColsDupe).forEach(key => {
			if (detailKey === key) {
				newLandscapeColsInOrder[key] = currentLandscapeColsDupe[key]
			}
		})
	})

	// return the new obj
	return newLandscapeColsInOrder
}

export const removeAllSpecificCancels = (
	gameDetails: any,
	currentLandscapeCols: {[key: string]: string},
) => {
	const allCancelsinObj = {}
	
	gameDetails.specificCancels.forEach(cancelObj =>
		Object.keys(cancelObj).forEach(cancelKey =>
			allCancelsinObj[cancelObj[cancelKey].dataFileKey] = cancelObj[cancelKey].dataTableHeader
		)
	)

	return createOrderedLandscapeColsObj(gameDetails, currentLandscapeCols, allCancelsinObj, "off")
}

export const handleNewCharacterLandscapeCols = (
	gameDetails: any,
	oldCharName: PlayerData["name"],
	newCharName: PlayerData["name"],
	autoSetSpecificCols: Boolean,
	currentLandscapeCols: {[key: string]: string},
) => {

	if (!autoSetSpecificCols) {
		return currentLandscapeCols;
	}
	
	const charNames = [oldCharName, newCharName]
	let oldCharColsRemoved;
	let newLandscapeColsInOrder;
	
	charNames.forEach((charName, index) => {
		const characterDataCategoryObj = createCharacterDataCategoryObj(charName, gameDetails.specificCancels)
		const colsToSet = {}
		Object.keys(characterDataCategoryObj).forEach(dataRow =>
			Object.keys(characterDataCategoryObj[dataRow]).forEach(dataEntryKey =>
				colsToSet[dataEntryKey] = characterDataCategoryObj[dataRow][dataEntryKey]["dataTableHeader"]
			)
		)
		
		if (index === 0) {
			oldCharColsRemoved = createOrderedLandscapeColsObj(gameDetails, currentLandscapeCols, colsToSet, "off")
		} else {
			newLandscapeColsInOrder = createOrderedLandscapeColsObj(gameDetails, oldCharColsRemoved, colsToSet, "on")
		}
		
	})
	
	return newLandscapeColsInOrder

}
