var foo = {
	'bar': function (a) {

		var self = this;
		self._somePrivateMember = a;
		return self._privateMethod(a) + a;
	},
	'_privateMethod': function (a) {
		return a * a;
	}
};

foo.bar();
foo._privateMethod(foo._somePrivateMember);