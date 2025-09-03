<script setup>
import * as echarts from 'echarts';
import Header from './components/Header.vue';
import { ref, onMounted, computed } from 'vue'
import { nextTick } from 'vue';


const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '项目',
    dataIndex: 'project',
    key: 'project',
  },
  {
    title: '加班',
    dataIndex: 'overtime',
    key: 'overtime',
  },
  {
    title: '工时',
    dataIndex: 'hours',
    key: 'hours',
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation'
  },
]

const user = ref()
const dataSource = ref([])
const chart = ref(null)
let myChart = null

function onDelete(id) {
  console.log(id);
  dataSource.value = dataSource.value.filter(item => item.id !== id);
  localStorage.setItem('tableData', JSON.stringify(dataSource.value));
  updateChart();
}


let map = computed(() => {
  // 计算图表所需的数据
  let projects = dataSource.value.map(item => item.project);
  projects = [...new Set(projects)];
  const map = new Map()
  projects.map(project => {
    const hours = dataSource.value
      .filter(item => item.project === project)
      .reduce((sum, item) => sum + item.hours, 0);
    map.set(project, hours);
  });
  return {
    map
  };
});

function updateChart() {
  const option = {
    title: {
      text: 'Project Hours Distribution'
    },
    tooltip: {},
    legend: {
      data: ['工时']
    },
    xAxis: {
      data: Array.from(map.value.map.keys())
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: Array.from(map.value.map.values())
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  option && myChart.setOption(option);
}

console.log(map.value.map.keys());

onMounted(async () => {

  user.value = JSON.parse(localStorage.getItem('user'));
  dataSource.value = JSON.parse(localStorage.getItem('tableData')) || dataSource.value;

  await nextTick();
  // 基于准备好的dom，初始化echarts实例
  myChart = echarts.init(chart.value);

  updateChart();
});


</script>

<template>
  <div class="main">
    <div class="header">
      <Header />
    </div>

    <div v-if="user">
      <div class="title">Tasks</div>
      <div class="content">
        <a-table :dataSource="dataSource" :columns="columns">
          <template #bodyCell="{ column, record }" v-if="user.username === 'admin'">
            <template v-if="column.key === 'operation'">
              <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="onDelete(record.id)">
                <a>delete</a>
              </a-popconfirm>
            </template>
          </template>
        </a-table>

        <div>
          <div id="main" ref="chart" style="width: 900px;height:400px;"></div>
        </div>
      </div>

    </div>


  </div>
</template>

<style scoped>
.main {
  padding: 40px 10px;
}

.header {
  display: flex;
  justify-content: center;
}

.content {
  display: flex;
  overflow: hidden;
  border: 1px solid #eee;
  padding: 5px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 0 10px;
}
</style>
