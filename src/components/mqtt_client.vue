<template>
  <div class="content">
    <div>
      <el-row>
        <el-col :span="24"><h1>{{title}}</h1></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button @click="dialogVisible=true">修改设置</el-button>
          <el-button @click="listDialog.show=true">主题订阅</el-button>
        </el-col>
      </el-row>

    </div>
    <!--log list-->
    <section class="log">
      <el-row class="log-option">
        <el-col :span="24">
          <div>
            <el-radio-group v-model="logData.logType">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="发布"></el-radio-button>
              <el-radio-button label="接受"></el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>

      <el-table :data="logData.list" style="width: 100%">
        <el-table-column prop="date" label="时间" width="180"></el-table-column>
        <el-table-column prop="type" label="类型" width="100"></el-table-column>
        <el-table-column prop="tipic" label="主题" width="100"></el-table-column>
        <el-table-column prop="address" label="内容"></el-table-column>
      </el-table>
    </section>

    <!--setting dialog-->
    <el-dialog title="设置信息" :visible.sync="dialogVisible" s>
      <el-form :inline="true" label-position="left" label-width="80">
        <el-form-item label="host">
          <el-input v-model="clientConfig.host"></el-input>
        </el-form-item>
        <el-form-item label="port">
          <el-input v-model="clientConfig.region"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--topiclist dialog-->
    <el-dialog title="主题列表" :visible.sync="listDialog.show">
      <el-form :inline="true" label-position="left" label-width="80">
        <el-form-item label="主题名称">
          <el-input v-model="listDialog.addName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="subscribeTopic">订阅</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table style="width:100%" :data="listDialog.list">
          <el-table-column prop="name" label="名称" width="280"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="danger" size="small" @click="unSubscribeTopic">取消订阅</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="listDialog.show = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  var mqtt = require('mqtt');
  import loading from './loading.vue'
  export default {
    name: 'hello',
    components: {
      loading
    },
    data() {
      return {
        title: "设备启动中",
        logType: '',
        dialogVisible: false,
        listDialog: {
          list: [
            {name: 'testTopic'}, {name: 'testTopic'},
          ],
          show: false,
          addName: ''
        },
        clientConfig: {
          host: '',
          port: ''
        },
        logData: {
          list: [],
          logType: ''

        }
      }

    },
    created() {
//      this.initClient();


    },
    methods: {
      initClient(){
        var client = mqtt.connect("ws://test.mosquitto.org"); // you add a ws:// url here
        client.subscribe("mqtt/demo");

        client.on('connect', function () {
          //订阅presence主题
          client.subscribe('presence');
          //向presence主题发布消息
          client.publish('presence', 'Hello mqtt');
        });
        client.on('message', function (topic, message) {
          //收到的消息是一个Buffer
          console.log(message.toString());
          client.end();
        });

      },
      /**
       * 订阅主题
       */
      subscribeTopic(type, name){
        let topic = ''
        if (type === 'auto') {
          topic = name;
        } else {
          topic = this.listDialog.addName;
          this.listDialog.addName = '';
        }
        if (true) {
          this.listDialog.list.push({name: topic});
          this.$message({
            message: "订阅成功",
            type: "success"
          })
        } else {
          this.$message({
            message: "订阅失败",
            type: "error"
          })
        }

      },
      unSubscribeTopic(type, topicName){
        let index;
        this.listDialog.list.forEach((v, i) => {
          if (v === topicName) {
            index = i;
          }
        });
        if (true) {
          this.listDialog.list.splice(index, 1);
          this.$message({
            message: "取消成功",
            type: "success"
          })
        } else {
          this.$message({
            message: "取消失败",
            type: "error"
          })
        }
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  header {
    display: flex;
    align-items: center;
  }

  .log-option {
    margin: 10px 0;
  }
</style>
