const personGenerator = {
    surnameJson: `{
        "count": 15,
        "list": {
            "id_1": "Иванов",
            "id_2": "Смирнов",
            "id_3": "Кузнецов",
            "id_4": "Васильев",
            "id_5": "Петров",
            "id_6": "Михайлов",
            "id_7": "Новиков",
            "id_8": "Федоров",
            "id_9": "Кравцов",
            "id_10": "Николаев",
            "id_11": "Семёнов",
            "id_12": "Славин",
            "id_13": "Степанов",
            "id_14": "Павлов",
            "id_15": "Александров",
            "id_16": "Морозов"}
    }`,
    firstNameMaleJson: `{
        "count": 10,
        "list": {     
            "id_1": "Александр",
            "id_2": "Максим",
            "id_3": "Иван",
            "id_4": "Артем",
            "id_5": "Дмитрий",
            "id_6": "Никита",
            "id_7": "Михаил",
            "id_8": "Даниил",
            "id_9": "Егор",
            "id_10": "Андрей"
        }
    }`,
    firstNameFemaleJson: `{
        "count": 10,
        "list": {     
            "id_1": "Ольга",
            "id_2": "Екатерина",
            "id_3": "Елизавета",
            "id_4": "Ирина",
            "id_5": "Наталья",
            "id_6": "Анна",
            "id_7": "Анастасия",
            "id_8": "Татьяна",
            "id_9": "Елена",
            "id_10": "Марина"
        }
    }`,

    professionMaleJson: `{
        "count": 10,
        "list": {     
            "id_1": "Манекен для краш-тестов",
            "id_2": "Решатель капчи",
            "id_3": "Пивной сомелье",
            "id_4": "Телеканал РЕН-ТВ: штатный экзорцист",
            "id_5": "Акробат - гомеопат",
            "id_6": "Гений, миллиардер, филантроп",
            "id_7": "UX/UI дизайнер Facebook (запрещено в РФ)",
            "id_8": "Разработчик браузера Амиго",
            "id_9": "Коллекционер плагинов VS Code",
            "id_10": "Проставитель точки с запятой в коде JS"
        }
    }`,

    professionFemaleJson: `{
        "count": 10,
        "list": {     
            "id_1": "Штатный таролог Московской биржи",
            "id_2": "Распутывательница проводов наушников",
            "id_3": "Автоответчица в колл-центре",
            "id_4": "Критик турецких сериалов",
            "id_5": "Металлургиня",
            "id_6": "Разрабатывательница феминитивов",
            "id_7": "Потомственная ведунья",
            "id_8": "Телеграм бот",
            "id_9": "PR менеджер Алексея Панина",
            "id_10": "Тренер личностного упадка"
        }
    }`,

    avatarMaleJson: `{
        "count": 10,
        "list": {     
            "id_1": "assets/m1.jpg",
            "id_2": "assets/m2.jpg",
            "id_3": "assets/m3.jpg",
            "id_4": "assets/m4.jpg",
            "id_5": "assets/m5.jpg",
            "id_6": "assets/m6.jpg",
            "id_7": "assets/m7.jpg",
            "id_8": "assets/m8.jpg",
            "id_9": "assets/m9.jpg",
            "id_10": "assets/m10.jpg"
        }
    }`,

    avatarFemaleJson: `{
        "count": 10,
        "list": {     
            "id_1": "assets/w1.jpg",
            "id_2": "assets/w2.jpg",
            "id_3": "assets/w3.jpg",
            "id_4": "assets/w4.jpg",
            "id_5": "assets/w5.jpg",
            "id_6": "assets/w6.jpg",
            "id_7": "assets/w7.jpg",
            "id_8": "assets/w8.jpg",
            "id_9": "assets/w9.jpg",
            "id_10": "assets/w10.jpg"
        }
    }`,

    monthOfBirthJson: `{
        "count": 12,
        "list": {
            "id_1": "января",
            "id_2": "февраля",
            "id_3": "марта",
            "id_4": "апреля",
            "id_5": "мая",
            "id_6": "июня",
            "id_7": "июля",
            "id_8": "августа",
            "id_9": "сентября",
            "id_10": "октября",
            "id_11": "ноября",
            "id_12": "декабря"
        }
    }`,

    GENDER_MALE: 'Мужчина',
    GENDER_FEMALE: 'Женщина',

    randomIntNumber: (max = 1, min = 0) => Math.floor(Math.random() * (max - min + 1) + min),

    randomValue: function (json) {
        const obj = JSON.parse(json);
        const prop = `id_${this.randomIntNumber(obj.count, 1)}`;  // this = personGenerator
        return obj.list[prop];
    },

    randomAvatar: function () {
        if (this.person.gender == 'Мужчина') {
            return this.randomValue(this.avatarMaleJson);
        } else {
            return this.randomValue(this.avatarFemaleJson);
        }
    },

    randomFirstName: function () {

        if (this.person.gender == 'Мужчина') {
            return this.randomValue(this.firstNameMaleJson);
        } else {
            return this.randomValue(this.firstNameFemaleJson);
        }

    },

    randomMiddleName: function () {

        let name = this.randomValue(this.firstNameMaleJson);
        let male = this.person.gender == 'Мужчина';

        if (name.slice(-1) == 'й') {
            return male ? name.slice(0, -1) + 'евич' : name.slice(0, -1) + 'евна';
        } else if (name == 'Никита') {
            return male ? name.slice(0, -1) + 'ич' : name.slice(0, -1) + 'ична';
        } else if (name.slice(-1) == 'а') {
            return male ? name.slice(0, -1) + 'ович' : name.slice(0, -1) + 'овна';
        } else if (name.slice(-2) == 'ил' && name.slice(-3) !== 'иил') {
            return male ? name.slice(0, -2) + 'йлович' : name.slice(0, -2) + 'йловна';
        } else if (name.slice(-2) == 'ил' && name.slice(-3) != 'иил') {
            return male ? name.slice(0, -2) + 'йлович' : name.slice(0, -2) + 'йловна';
        } else {
            console.log(name);
            return male ? name + 'ович' : name + 'овна';
        }

    },

    randomSurname: function () {

        return this.person.gender == 'Мужчина' ? this.randomValue(this.surnameJson) : this.randomValue(this.surnameJson) + 'а';

    },

    randomGender: function () {

        return this.randomIntNumber() === 0 ? this.GENDER_MALE : this.GENDER_FEMALE;

    },

    randomDate: function () {
        const year = this.randomIntNumber(2010, 1990);
        const month = this.randomValue(this.monthOfBirthJson);
        let day;
        if (month == 'апреля' || month == 'июня' || month == 'сентября' || month == 'ноября') {
            // если один из этих месяцев, значит в нем 30 дней
            day = this.randomIntNumber(30, 1);
        } else if (month == 'февраля') {
            // чтобы определить, сколько дней в феврале, нужно узнать високосный год или нет. Для этого добавляем условие
            if ((year/4) % 1 === 0) {
                // если год делится на 4 без остатка, значит он високосный
                day = this.randomIntNumber(29, 1);
            } else {
                day = this.randomIntNumber(28, 1);
            }
        } else {
            // во всех остальных случаях - 31 день.
            day = this.randomIntNumber(31, 1);
        }

        return (`${day} ${month} ${year}`);
    },

    randomProfession: function () {
        if ((this.person.gender == 'Мужчина')) {
            return this.randomValue(this.professionMaleJson);
        } else {
            return this.randomValue(this.professionFemaleJson);
        }
    },


    getPerson: function () {
        this.person = {};
        this.person.gender = this.randomGender();
        this.person.avatar = this.randomAvatar();
        this.person.firstName = this.randomFirstName();
        this.person.middleName = this.randomMiddleName();
        this.person.surname = this.randomSurname();
        this.person.birthDate = this.randomDate();
        this.person.profession = this.randomProfession();
        return this.person;
    }
};