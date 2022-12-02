$(function(){
    // 去注册账号的点击事件
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 去登入点击事件
    $('#link_login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })

    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        repwd:function(value){
            let pwd = $('.reg-box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致！'
            }
        }
    })
     $('#form_reg').on('submit',function(e){
         e.preventDefault()
         
         $.post('/api/reguser',{username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()},function(res){
             if(res.status !== 0){
                 return layer.msg(res.message)
                 
             }
           layer.msg('注册成功');
           $('#link_login').click()
             
         })
         
     })

     $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method:'post',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){   
                    return layer.msg('登入失败！')
                }
                console.log(123);
                
                layer.msg('登入成功！')
                localStorage.setItem('token',res.token)
                console.log(1111);
                
                location.href = '/index.html'
            }
        })
     })
})