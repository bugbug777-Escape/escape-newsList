import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js";

// API
const api_base = "https://hex-escape-room.herokuapp.com";

// Moment.js Locale
moment.locale("zh-tw", {
  longDateFormat: {
    LLLL: "YYYY/M/DD Ah:mm:ss"
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function (h, meridiem) {
    let hour = h;
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === "凌晨" || meridiem === "早上" || meridiem === "上午") {
      return hour;
    } else if (meridiem === "下午" || meridiem === "晚上") {
      return hour + 12;
    } else {
      // '中午'
      return hour >= 11 ? hour : hour + 12;
    }
  },
  meridiem: function (hour, minute, isLower) {
    const hm = hour * 100 + minute;
    if (hm < 600) {
      return "凌晨";
    } else if (hm < 900) {
      return "早上";
    } else if (hm < 1130) {
      return "上午";
    } else if (hm < 1230) {
      return "中午";
    } else if (hm < 1800) {
      return "下午";
    } else {
      return "晚上";
    }
  }
});

const app = createApp({
  data() {
    return {
      newsList: [],
      temp: {},
      isShow: false
    };
  },
  methods: {
    get_all_news() {
      const api = `${api_base}/api/cors/news`;
      axios.get(api).then((res) => {
        this.newsList = res.data.data;
      });
    },
    get_one_news(id) {
      const corsURL = "https://cors-anywhere.herokuapp.com/";
      const api = `${api_base}/api/cors/news/${id}`;
      axios.get(`${corsURL}${api}`).then((res) => {
        this.temp = res.data.data;
        this.isShow = true;
      });
    },
    date_formator(d) {
      // 2022/2/15 上午5:30:00
      const formator = "YYYY/M/DD Ah:mm:ss";
      const timestamp = new Date(d);
      const str = moment(timestamp).format(formator);
      return str;
    },
    toggle_news(id) {
      if (!this.isShow || id !== this.temp.id) {
        this.get_one_news(id);
      } else if (id === this.temp.id) {
        // 如果 id 相同不要有行為好像比較好
      } else {
        this.isShow = false;
      }
    }
  },
  mounted() {
    this.get_all_news();
  }
});

app.mount("#app");
