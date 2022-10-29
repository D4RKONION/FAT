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
	landscapeCols: {[key: string]: string},
	dataEntryKey: string,
	dataTableHeader: string,
	forceMode: "off" | "on" | "none",
) => {

	const keysInOrder = [];
	const landscapeColsInOrder = {};

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

	// Handle the new landscape column to be set
	if (forceMode === "off") {
		delete landscapeCols[dataEntryKey];
	} else if (forceMode === "on" || !landscapeCols[dataEntryKey]) {
		landscapeCols[dataEntryKey] = dataTableHeader;
	} else {
		delete landscapeCols[dataEntryKey];
	}

	// reorder the landscape columns before returning it
	keysInOrder.forEach(detailKey => {
		Object.keys(landscapeCols).forEach(key => {
			if (detailKey === key) {
				landscapeColsInOrder[key] = landscapeCols[key]
			}
		})
	})

	return landscapeColsInOrder;

}

