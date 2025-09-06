<script setup>
import * as echarts from 'echarts';
// import Header from './components/Header.vue';
import { ref, onMounted, computed, watch } from 'vue'
import { nextTick } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { usePagination } from 'vue-request';

const router = useRouter();
const total = ref(0);
const current = ref(1);
const pageSize = ref(5);


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
        // width: '30%',
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


const handleTableChange = async (
    pag,
    filters,
    sorter,
) => {
    // console.log('各种变化', pag, filters, sorter);
    current.value = pag.current;
    pageSize.value = pag.pageSize;
    await fetchData(current.value, pageSize.value);
    // run(pag.current, pag.pageSize);
    // nextTick(() => {
    //     updateChart();
    // });
};

// async function fetchData(current = 1, pageSize = 5) {
//     // console.log('fetchData', current, pageSize);
//     const res = await axios.get(`/data/list?page=${current}&results=${pageSize}`);
//     if (res.data.code !== 200) {
//         alert("获取数据失败");
//         return;
//     }
//     dataSource.value = res.data.data.data;
//     total.value = res.data.data.total;
// }

const queryData = (current = 1, pageSize = 5) => {
    return axios.get(`/data/list?page=${current}&results=${pageSize}`);
};


const {
    // data,
    run,
    loading,
    // current,
    // pageSize,
} = usePagination(queryData, {
    // formatResult: res => res.data.data.data,
    onSuccess: (res) => {
        total.value = res.data.data.total;
        dataSource.value = res.data.data.data;
        console.log('获取数据成功', res);
    },
    pagination: {
        currentKey: 'page',
        pageSizeKey: 'results',
    },
});

const fetchData = async (current = 1, pageSize = 5) => {
    run(current, pageSize);
};


const pagination = computed(() => ({
    total: total.value,
    current: current.value,
    pageSize: pageSize.value,
}));

async function onDelete(id) {
    // dataSource.value = dataSource.value.filter(item => item.id !== id);
    const res = await axios.delete(`/data/delete/${id}`)
    // console.log('删除', res);
    if (res.data.code !== 200) {
        alert("删除失败");
        return;
    }
    await fetchData();
    updateChart();
}

async function updateChart() {

    const res = await axios.get("/data/chart")
    // console.log(res.data)
    if (res.data.code !== 200) {
        console.log("获取表格数据失败")
    }

    const option = {
        title: {
            text: 'Project Hours Distribution'
        },
        tooltip: {},
        legend: {
            data: ['工时']
        },
        xAxis: {
            data: res.data.data.xData
        },
        yAxis: {},
        series: [
            {
                name: '工时',
                type: 'bar',
                data: res.data.data.yData
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    option && myChart.setOption(option);
}

const onLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
};


onMounted(async () => {

    user.value = JSON.parse(localStorage.getItem('user'));

    await fetchData();

    await nextTick();
    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(chart.value);

    updateChart();
});

const all = "all"


</script>

<template>
    <div class="main">

        <div v-if="user">
            <div class="head">
                <div class="title">Tasks</div>
                <a-button style="margin-left: 20px;" type="primary" html-type="button" @click="onLogout">Login
                    out</a-button>
            </div>

            <div class="content">
                <a-table class="table" :dataSource="dataSource" :columns="columns" :pagination="pagination"
                    :loading="loading" @change="handleTableChange" :row-key="record => record.id">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'overtime'">
                            <span>
                                <a-tag :color="record.overtime === true ? 'geekblue' : 'green'">
                                    {{ record.overtime === true ? '是' : '否' }}
                                </a-tag>
                            </span>
                        </template>

                        <!-- <template> -->
                        <template v-if="column.key === 'operation'">
                            <!-- <div > -->
                            <a-popconfirm v-if="dataSource.length" title="Sure to delete?"
                                @confirm="onDelete(record.id)">
                                <a v-permission="all">delete</a>
                            </a-popconfirm>
                            <!-- </div> -->

                        </template>
                        <!-- </template> -->

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

.head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    margin-bottom: 20px;
}

.table {
    width: 100%;
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
    /* margin-bottom: 20px; */
    /* padding: 0 10px; */
}
</style>
