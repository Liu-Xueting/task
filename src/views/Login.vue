<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';


const router = useRouter();

const formState = ref({
    username: '',
    password: '',
});
const onFinish = (values) => {
    console.log('Success:', values);
    axios.post('/login', values).then(response => {
        if (response.data.code === 200) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
            // location.reload();
            router.push('/');

        }
    }).catch(error => {
        console.log(error);
    });
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};


</script>

<template>
    <div class="header">

        <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="Username" name="username"
                :rules="[{ required: true, message: 'Please input your username!' }]">
                <a-input v-model:value="formState.username" />
            </a-form-item>

            <a-form-item label="Password" name="password"
                :rules="[{ required: true, message: 'Please input your password!' }]">
                <a-input-password v-model:value="formState.password" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 40 }">
                <a-button type="primary" html-type="submit">Login in</a-button>

            </a-form-item>
        </a-form>
    </div>

</template>

<style scoped>
.header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    margin-top: 50px;
}
</style>
