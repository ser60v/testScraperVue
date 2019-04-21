<template>
  <div id="app">
    <div class="main-data">
      <div class="live content">
        <div v-for="event in data" class="event">
          <div class="event-title">
            <span class="event-time">{{event.title.time}}</span>
            <span class="event-name">{{event.title.name1}}</span>
            <span class="event-name">{{event.title.name2}}</span>
            <span>{{event.title.code}}</span>
          </div>
          <div v-for="(dataSet, index) in event.data" class="event-data">
            <div  class="event-dataset">
              <div>
                Set{{index+1}}:
              </div>
              <div v-for="value in dataSet" class="dataset-value">
                {{value}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      data: []
    }
  },
  methods: {
    /**
     * Connect on ws.
     * Get data after each change
     */
    connect() {
      this.socket = new WebSocket(`ws://${document.domain}:5000`);
      this.socket.onopen = () => {
        this.socket.onmessage = ({data}) => {
          this.data = JSON.parse(data);
        };
      };
    }
  },
  created() {
    this.connect()
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .main-data {
    font-size: 0.9em;
  }
  .main-data > .content {
    display: flex;
    flex-direction: column;
    padding-top: 3vw;
    width: 100%;
  }
  .event {
    width: 500px;
    margin-bottom: 2em;
  }
  .event-title {
    width: 100%;
    display: flex;
  }
  .event-time {
    padding-right: 1em;
    width: 10em;
  }
  .event-name {
    display: inline-block;
    font-weight: 600;
    width: 10em;
  }
  .event-data{
    width: 100%;
  }
  .event-dataset{
    display: flex;
  }
  .dataset-value {
    width: 4em;
    margin: 0.1em;
    text-align: center;
  }
  .dataset-value:nth-child(odd) {
    background-color: #d3d3d3;
  }
  .live {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
