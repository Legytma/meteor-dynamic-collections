import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

DynamicCollections = DynamicCollections || {};

DynamicCollections.records = new Meteor.Collection("records", {_suppressSameNameError: true});

DynamicCollections.records.allow({
	insert: function(userId, doc) {
		return !!userId;
	},
	update: function(userId, doc) {
		return !!userId;
	}
});

DynamicCollections.fields = new Mongo.Collection("fields", {_suppressSameNameError: true});

DynamicCollections.fields.allow({
	insert: function(userId, doc) {
		return !!userId;
	},
	update: function(userId, doc) {
		return !!userId;
	}
});

DynamicCollections.schema = (collectionFilter) => {
	//check(collectionFilter, String);
	resultedRecord = DynamicCollections.records.findOne(collectionFilter);

	schema = {};

	//console.log(DynamicCollections);
	//console.log(DynamicCollections.records);
	//console.log(DynamicCollections.fields);
	console.log(collectionFilter);
	//console.log(resultedRecord);
	fieldResults = DynamicCollections.fields.find({record: resultedRecord._id}).fetch();

	fieldResults.forEach((fieldResult) => {
		field = {};

		if (fieldResult.type != undefined) {
			switch(fieldResult.type) {
				case "String":
					field.type = String;

					break;
				case "Boolean":
					field.type = Boolean;

					break;
				case "Array":
					field.type = Array;

					break;
				case "Integer":
					field.type = Integer;

					break;
				case "Date":
					field.type = Date;

					break;
				default:
					field.type = String;
			}
		}

		if (fieldResult.description != undefined) {
			field.label = fieldResult.description;
		}

		if (fieldResult.optional != undefined) {
			field.optional = fieldResult.optional;
		}

		schema[fieldResult.name] = field;
	});

	//console.log(schema);
	currentSimpleSchema = new SimpleSchema(schema, {tracker: Tracker});
	currentSimpleSchema.extend(AuditSchema);

	//console.log(currentSimpleSchema);
	return currentSimpleSchema;
}

DynamicCollections.collection = (collectionFilter) => {
	//check(collectionFilter, String);
	resultedRecord = DynamicCollections.records.findOne(collectionFilter);

	currentSimpleSchema = DynamicCollections.schema(collectionFilter);

	resultCollection = new Mongo.Collection(resultedRecord.name, {_suppressSameNameError: true});

	resultCollection.allow({
		insert: function(userId, doc) {
			return !!userId;
		},
		update: function(userId, doc) {
			return !!userId;
		}
	});

	resultCollection.attachSchema(currentSimpleSchema, {replace: true});

	return resultCollection;
}

DynamicCollections.reverseEngine = (collectionFilter, sampleFilter) => {
	//check(collectionFilter, String);
	//check(sampleFilter, String);

	// OK, that's all the info we need - Let's get started!
	var message = eval("DynamicCollections.collection(" + collectionFilter + ").findOne(" + sampleFilter +")");
	var count = 0;
	// Hack because I can't figure out how to find out how many fields are in 
	var numKeys = 0;

	console.log("message:");
	console.log(message);

	for(var key in message) {
		numKeys += 1
	}

	var index = 0;
	var result = "{";

	for (var key in message) {
		if (key.charAt(0) != "_") {
			result += key + ":{";
			result += "type:" + DynamicCollections.toProper(eval("typeof DynamicCollections.collection(" + collectionFilter + ").findOne(" + sampleFilter + ")." + key)) + ",";
			result += "label:\"" + DynamicCollections.toProper(key) + "\"}";
		}

		if ((index > 0) && (index < numKeys - 1)) {
			result += ",";
		}

		index += 1;
	}

	result += "}";

	return result;
}

DynamicCollections.toProper = (str) => {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}
