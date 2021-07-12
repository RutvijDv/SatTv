"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesDb = exports.channelsDb = exports.packsDb = void 0;
var index_1 = require("../models/index");
function packsDb() {
    var channelsGold = ["Zee", "Sony", "Star Plus", "Discovery", "NatGeo"];
    var channelPackGold = new index_1.BasePack({
        type: "G",
        name: "Gold",
        price: 100,
    });
    channelPackGold.channels = channelsGold;
    var upsertDataGold = channelPackGold.toObject();
    delete upsertDataGold._id;
    index_1.BasePack.updateOne({ name: channelPackGold.name }, upsertDataGold, { upsert: true }, function (err) {
        if (err)
            throw err;
    });
    var channelsSilver = ["Zee", "Sony", "Star Plus"];
    var channelPackSilver = new index_1.BasePack({
        type: "S",
        name: "Silver",
        price: 50,
    });
    channelPackSilver.channels = channelsSilver;
    var upsertDataSilver = channelPackSilver.toObject();
    delete upsertDataSilver._id;
    index_1.BasePack.updateOne({ name: channelPackSilver.name }, upsertDataSilver, { upsert: true }, function (err) {
        if (err)
            throw err;
    });
}
exports.packsDb = packsDb;
function channelsDb() {
    var channelsCommon = ["Zee", "Sony", "Star Plus", "Discovery", "NatGeo"];
    var price = [10, 15, 20, 10, 20];
    var index = 0;
    while (index < channelsCommon.length) {
        var channel = new index_1.Channels({
            name: channelsCommon[index],
            price: price[index],
        });
        var upsertDataCommon = channel.toObject();
        delete upsertDataCommon._id;
        index_1.Channels.updateOne({ name: channelsCommon[index] }, upsertDataCommon, { upsert: true }, function (err) {
            if (err)
                throw err;
        });
        index++;
    }
}
exports.channelsDb = channelsDb;
function servicesDb() {
    var services = ["LearnEnglish", "LearnCooking"];
    var price = [200, 100];
    var index = 0;
    while (index < services.length) {
        var service = new index_1.Services({
            name: services[index],
            price: price[index],
        });
        var upsertDataService = service.toObject();
        delete upsertDataService._id;
        index_1.Services.updateOne({ name: services[index] }, upsertDataService, { upsert: true }, function (err) {
            if (err)
                throw err;
        });
        index++;
    }
}
exports.servicesDb = servicesDb;
