<script setup>
import { ref } from 'vue';

const users = [
  {
    username: 'admin',
    password: 'admin'
  },
  {
    username: 'user',
    password: 'user'
  }
]


const dataSource = ref([
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
  }
])

const formState = ref({
  username: '',
  password: '',
});
const onFinish = (values) => {
  console.log('Success:', values);
  const user = users.find(u => u.username === values.username && u.password === values.password);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    const tableData = JSON.parse(localStorage.getItem('tableData'));
    if (!tableData) {
      localStorage.setItem('tableData', JSON.stringify(dataSource.value));
    }
    // 刷新页面
    location.reload();
    alert('Login successful!');
  } else {
    alert('Invalid username or password');
  }
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const onLogout = () => {
  localStorage.removeItem('user');
  // localStorage.removeItem('tableData');
  location.reload();
};
</script>

<template>
  <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
    @finish="onFinish" @finishFailed="onFinishFailed">
    <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 4, span: 40 }">
      <a-button type="primary" html-type="submit">Login in</a-button>
      <a-button style="margin-left: 20px;" type="primary" html-type="button" @click="onLogout">Login out</a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped></style>
