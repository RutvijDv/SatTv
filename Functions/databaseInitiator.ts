import { BasePack, Channels, Services } from "../models/index";

function packsDb(): void {
  const channelsGold: string[] = ["Zee", "Sony", "Star Plus", "Discovery", "NatGeo"];
  let channelPackGold = new BasePack({
    type: "G",
    name: "Gold",
    price: 100,
  });
  channelPackGold.channels = channelsGold;

  let upsertDataGold = channelPackGold.toObject();
  delete upsertDataGold._id;
  BasePack.updateOne(
    { name: channelPackGold.name },
    upsertDataGold,
    { upsert: true },
    function (err) {
      if (err) throw err;
    }
  );

  const channelsSilver: string[] = ["Zee", "Sony", "Star Plus"];
  let channelPackSilver = new BasePack({
    type: "S",
    name: "Silver",
    price: 50,
  });
  channelPackSilver.channels = channelsSilver;

  let upsertDataSilver = channelPackSilver.toObject();
  delete upsertDataSilver._id;
  BasePack.updateOne(
    { name: channelPackSilver.name },
    upsertDataSilver,
    { upsert: true },
    function (err) {
      if (err) throw err;
    }
  );
}

function channelsDb(): void {
  const channelsCommon: string[] = ["Zee", "Sony", "Star Plus", "Discovery", "NatGeo"];
  const price = [10, 15, 20, 10, 20];
  let index = 0;

  while (index < channelsCommon.length) {
    let channel = new Channels({
      name: channelsCommon[index],
      price: price[index],
    });

    var upsertDataCommon = channel.toObject();
    delete upsertDataCommon._id;
    Channels.updateOne(
      { name: channelsCommon[index] },
      upsertDataCommon,
      { upsert: true },
      function (err) {
        if (err) throw err;
      }
    );
    index++;
  }
}

function servicesDb(): void {
  const services = ["LearnEnglish", "LearnCooking"];
  const price = [200, 100];
  let index = 0;

  while (index < services.length) {
    var service = new Services({
      name: services[index],
      price: price[index],
    });

    let upsertDataService = service.toObject();
    delete upsertDataService._id;
    Services.updateOne(
      { name: services[index] },
      upsertDataService,
      { upsert: true },
      function (err) {
        if (err) throw err;
      }
    );
    index++;
  }
}

export { packsDb, channelsDb, servicesDb };
