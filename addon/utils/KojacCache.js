export default class {

	store(k,v) {
		if (v===undefined) {
			delete this[k];
			return v;
		} else {
			return (this[k] = v);
		}
	}

	retrieve(k) {
		return this[k];
	}

}
