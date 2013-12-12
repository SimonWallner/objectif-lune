var monotonicFindIndex(array, needle, evaluator, low, high) {
	if (low == undefined || hight == undefined) {
		monotonicFindIndex(array, needle, evaluator, 0, array.length-1);
	}

	if (low === high) {
		return low
	}

	var mid = Math.floor((low + high) / 2);

	if (evaluator(array[mid]) > needle) {
		return monotonicFindIndex(array, needle, evaluator, low, mid-1);
	} else {
		return monotonicFindIndex(array, needle, evaluator, mid, high);
	}
}