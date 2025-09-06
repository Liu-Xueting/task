// const Mock = require('mockjs')
import Mock from 'mockjs'
import { ref, computed } from 'vue'

const data = ref([
    {
        "id": "001",
        "project": "Road Project A",
        "overtime": true,
        "hours": 3.5,
        "created_at": "2024-04-10 10:30"
    },
    {
        "id": "002",
        "project": "Bridge Maintenance B",
        "overtime": false,
        "hours": 2,
        "created_at": "2024-04-09 13:00"
    },
    {
        "id": "003",
        "project": "Pipeline Fix C",
        "overtime": true,
        "hours": 4.5,
        "created_at": "2024-04-08 08:00"
    },
    {
        "id": "004",
        "project": "Bridge Maintenance B",
        "overtime": true,
        "hours": 3,
        "created_at": "2024-04-07 16:45"
    },
    {
        "id": "005",
        "project": "Tunnel Cleaning D",
        "overtime": false,
        "hours": 8.1,
        "created_at": "2024-04-03 11:43"
    },
    {
        "id": "006",
        "project": "Pipeline Fix C",
        "overtime": false,
        "hours": 2.5,
        "created_at": "2024-04-03 11:43"
    },
    {
        "id": "007",
        "project": "Tunnel Cleaning D",
        "overtime": false,
        "hours": 1,
        "created_at": "2024-04-03 11:43"
    }
]);

const map = computed(() => {
    // 计算图表所需的数据
    // console.log(formatResult)
    let projects = data.value.map(item => item.project);
    projects = [...new Set(projects)];
    const map = new Map()
    projects.map(project => {
        const hours = data.value
            .filter(item => item.project === project)
            .reduce((sum, item) => sum + item.hours, 0);
        map.set(project, hours);
    });
    return {
        map
    };
});

export const dataSource = Mock.mock(/\/data\/list/, "get", (options) => {
    // console.log('options', options);
    const url = new URL('http://localhost' + options.url)
    const page = parseInt(url.searchParams.get('page')) || 1;
    const results = parseInt(url.searchParams.get('results')) || 5;

    const start = (page - 1) * results;
    const end = start + results;
    return {
        code: 200,
        msg: "Data fetched successfully",
        data: {
            total: data.value.length,
            data: data.value.slice(start, end)
        }
    }
});

export const charts = Mock.mock(/\/data\/chart/, "get", () => {

    const xData = Array.from(map.value.map.keys())
    const yData = Array.from(map.value.map.values())

    return {
        code: 200,
        msg: "chart fetched successfully",
        data: {
            xData,
            yData
        }
    }
})


export const login = Mock.mock("/login", "post", (options) => {
    const { username, password } = JSON.parse(options.body);
    if ((username === 'admin' && password === 'admin') || (username === 'user' && password === 'user')) {
        return {
            code: 200,
            msg: "Login successful",
            data: {
                username: username,
                permissions: username === 'admin' ? 'all' : 'read-only'
            }
        }
    } else {
        return {
            code: 401,
            msg: "Invalid username or password",
        }
    }
});

export const deleteItem = Mock.mock(/\/data\/delete\/\d+/, "delete", (options) => {
    const id = options.url.match(/\/data\/delete\/(\d+)/)[1];
    const index = data.value.findIndex(item => item.id === id);
    if (index !== -1) {
        data.value.splice(index, 1);
        return {
            code: 200,
            msg: "Delete successful"
        }
    } else {
        return {
            code: 404,
            msg: "Item not found"
        }
    }
});
