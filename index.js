require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const ROLE_ID = "1450722505588215869";

const CZYNY = [
  "{user} zrobił/a coś podejrzanego.",
  "{user} wykazał/a niepokojące zachowanie.",
  // "{user} zjadł/a cudzą kremówkę. Brzydko.",
"{user} był/a obecny/a, lecz mentalnie nie. Ciekawe o czym myśli.",
"{user} wykazał/a nadmierny entuzjazm. Ciekawe co to za namiot.",
"{user} ciągnie redute ordona. Mnaim.",
"{user} obserwuje swoją babcie na onlyfansie. Podeślij linka, chętnie popatrzymy...",
"{user} chwali się długością swojej różdżki. Pssst Nie ma czym...",
"Dziadek {user} łapał pokemony w gestapo. Odziedziczył/a nawet kartę złotego żyda.",
"{user} dzwoni jajami na kolędzie. Prawdziwy wirtuoz.",
"{user} sra na stojąco. Chcesz papier?",
"{user} ciągnie drzwi kiedy ma napisane pchać. Głupiutko.",
"{user} chodzi po domach jechowych pytać czy chcą rozmawiać o naszym Panie i Zbawcy imperatorze.",
"{user} czyta tre≥ść ulotki przed zażyciem stoperanu. Pssst o nie pomoże.",
"{user} je sernik z rodzynkami. Wstyd.",
"{user} sypie płatki do mleka zamiasr lać mleko do płatków. Wstyd.",
"{user} wydłubał/a oko pijąc herbatę z łyzeczką. Teraz jest cyklopem.",
"{user} dostał/a wilka siedząc na kafelkach. Auuuuuuu!",
"{user} strzela z łuku brwiowego. Katniss Everdeen mogłaby się uczyć.",
"{user} umawia się do wulkanizatora na wymianę opony mózgowej. Podaj numer, może komuś się przyda.",
"{user} prosi żula o 2 złote. Po≥życzylibyśmy Ci..",
"{user} zaciąga pożyczkę w powerbanku. Pożycz 2 zeta!",
"{user} dochodzi do reduty ordona. Można i tak!",
"{user} nie zna wzorów skróconego mnożenia. Chańba!",
"{user} nie ma napletka... bywa i tak.",
"{user} śpi nago. Ale ma kutasa!",
"{user} podkochuje się w Mateuszu Morawieckim. Widzieliście ten długi nos?",
"{user} sekretnie słucha Taylor Swift. A jednak...",
"{user} ma dzisiaj - 100 do aury. To nie twój dzień czarodzieju.",
"{user} zostaje rerptilianinem. Pokaz język.",
"{user} onanizuje się do piosenki z mission impossible. Ale czy warto?",
"{user} jest 60. Brzydko oj brzydko...",
"{user} dopuszcza się kradzieży różańca swojej babci. A ona modliła się o twoje zbawienie szumowino...",
"{user} chodzi na automaty we wtorki. Hazardzista.",
"{user} wali konia do Krzystofa Bosaka.  Jest do czego.",
"{user} chce zrobic sobie operacje plastyczną żeby wyglądać jak Tusk. Ale czy warto?",
"{user} głosuje na Biejat. No cóż",
"{user} nie myje się już tydzień. Fuj!",
"{user} chętnie pokazuje dzieciom kotki w piwnicy. Co za pdf!",
"{user} łowi ryby w stawie kolanowym. Milicz masz bliżej ale okay.",
"{user} śni o trójkącie z twoją starą. Może ojciec dołączy?",
"{user} marzy o bbc. To może jakieś misje w afryce?",
"{user} wspiera eurokołchoz. Grzesiu się Ciebie wstydzi.",
"{user} jest za obaleniem żydokomuny. Braun daje Ci błogosławieństwo!",
"{user} sympatyzuje z państwem islamskim!",
"{user} sympatyzuje z izraelem. Szalom!",
"{user} jest eunuchem ale są tego korzyści...",
"{user} lubi w dupe.",
"{user} nie ma dzisiaj majtek. Wyślij nudesa.",
"{user} właśnie goli sobie jaja maszynką swojej matki - fuj",
"{user} widzi srebrnego breka. To będzie pomyślny dzień.",
"{user} jest odpowiedzialny/a za zniknięcie karoliny północnej. Pierdolony Jimbo James!",
"{user} ma daddy issue, uważajcie na swoich ojców.",
"{user} lubi być obserwowany/a. Albo udaje, że nie. Perwert.",
"{user} Nie zaprzeczył a to wystraczy. Mamy dowód!",
"{user} twierdzi, że walenie konia do stopek to nie fetysz. Zawsze tak jest zboczuchu...",
"{user} wybrał nick sugerujący uległość, albo dominację...",
"{user} Ma zajebiste cycki, ale czy prawdziwe?"



];

const GODZINY = [
  '6 9 * * *',
  '10 14 * * *',
  '26 20 * * *'
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log("DONOS BOT AKTYWNY");

  GODZINY.forEach(time => {
    cron.schedule(time, async () => {
      const guild = client.guilds.cache.first();
      if (!guild) return;

      const members = await guild.members.fetch();

      const humans = members.filter(m =>
        !m.user.bot && m.roles.cache.has(ROLE_ID)
      );

      if (humans.size === 0) {
        console.log("Brak osób z rolą");
        return;
      }

      const randomMember = humans.random();
      const randomCzyn = CZYNY[Math.floor(Math.random() * CZYNY.length)];
      const tekst = randomCzyn.replace("{user}", `${randomMember}`);

      const channel = await client.channels.fetch(process.env.CHANNEL_ID);

      channel.send(
        `🚨 ⏰ **RAPORT DZIENNY**\n\n${tekst}\n\n🚨 ⏰`
      );
    });
  });
});
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.content !== '!donos') return;

  const members = await message.guild.members.fetch();

  const humans = members.filter(m =>
    !m.user.bot && m.roles.cache.has(ROLE_ID)
  );

  if (humans.size === 0) {
    return message.reply("🚨 Brak obywateli objętych obserwacją.");
  }

  const randomMember = humans.random();
  const randomCzyn = CZYNY[Math.floor(Math.random() * CZYNY.length)];
  const tekst = randomCzyn.replace("{user}", `${randomMember}`);

  const donosChannel = await client.channels.fetch(process.env.DONOS_CHANNEL_ID);

donosChannel.send(

    `🚨 **DONOS RĘCZNY**\n\n${tekst}\n\n🚨`
  );
});

client.login(process.env.TOKEN);
