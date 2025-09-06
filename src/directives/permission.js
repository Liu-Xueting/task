export default {
    mounted(el, binding) {
        const user = JSON.parse(localStorage.getItem('user'))
        const permission = binding.value
        // console.log(binding)
        // console.log(permission)
        console.log(el.parentNode)
        if (user.permissions !== permission) {
            // console.log("执行了")
            setTimeout(() => {
                el.parentNode && el.parentNode.removeChild(el)
            }, 0)
        }
    }
}
