const Genres = {
	male: 0,
	female: 1,
	other: 2,
}

const Games = {
	roblox: 0,
	minecraft: 1,
	fortnite: 2,
	fallGuys: 3,
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export default {
	Genres,
	Games,
	getKeyByValue,
}