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
    <el-dialog title="设置信息" :visible.sync="dialogVisible">
      <el-form :model="clientConfig" ref="clientConfig" :inline="true" label-position="left" label-width="80"
               :rules="rules">
        <el-form-item label="host" prop="host">
          <el-input v-model="clientConfig.host"></el-input>
        </el-form-item>
        <el-form-item label="port" prop="port">
          <el-input v-model.number="clientConfig.port"></el-input>
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
  const mqtt = require('mqtt');
  const conf = require('../assets/config')
  import loading from './loading.vue'
  export default {
    name: 'hello',
    components: {
      loading
    },
    data() {
      return {
        config: {
          host: '',
          port: ''
        },
        //连接实例
        client:{},
        title: "设备启动中",
        logType: '',
        dialogVisible: false,
        listDialog: {
          list: [

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
        },
        //form rules
        rules: {
          host: [{required: true}],
          port: [{required: true}, {type: "number"}]
        }
      }

    },
    created() {
      this.initClient();


    },
    methods: {
      //表单验证结果
      submitForm(forName){
        this.$refs[forName].validate((value) => {
          if (value) {
            return true
          } else {
            return false
          }
        });
      },
      initClient(){
        // 连接 MQTT Broker
        const client = mqtt.connect(conf.host, conf)
        this.client = client;
        // 连接 MQTT 成功 HOOK
        client.on('connect', () => {
          console.log('connected')
          this.$message({
            type:"success",
            message:"MQTT已连接"
          })
          this.title="设备已上线"
          this.subscribeTopic('t-uconf/id/+/#',0)
          this.subscribeTopic('t-udata/id/+/#',0)

        })
        // 触发重连 MQTT HOOK
        client.on('reconnect', () => {
          console.log('reconnect')
          this.$message({
            type:'warning',
            message:'正在重新连接'
          })
          this.title="重连中"
        })
        client.on('packetsend',(packet)=>{
            console.log(packet)
        });
        client.on('packetreceive',(packet)=>{
          console.log(packet)
        });

        // 收到 消息 HOOK
        client.on('message', (topic, message) => {
          console.log(topic, message.toString())
        })

        // 发生错误 HOOK
        client.on('error', () => {
          this.$message.error("连接服务器失败")
          console.log("error occurred");
        });

      },


      subscribeTopic(topic,qos){
        qos?qos:0;
        this.client.subscribe(topic,qos,(err,granted)=>{
          if (err) {
            this.$message({
              message: "订阅失败",
              type: "error"
            })
          } else {
            this.listDialog.list.push({name: topic});
          }

        })


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
