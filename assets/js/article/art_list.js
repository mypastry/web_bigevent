$(function(){
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    let q = {
        pagenum:1,
        pagesize:2,
        cate_id:'',
        state:''
    }

    template.defaults.imports.dataFormat = function(){
        let dt = new Date()
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth()+1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss    }

        function padZero(n){
           return  n> 9 ? n : '0'+ n
        }
    initTable()
    initCate()
    function initTable(){
        $.ajax({
            method:'get',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！')
                }
                layer.msg('获取列表数据成功')
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
            

        
        })
    }
    
    function initCate(){
        $.ajax({
            method:'get',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败')
                }
                let htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    $('#form-search').on('submit',function(e){
        e.preventDefault()
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    function renderPage(total){
        laypage.render({
            elem:'pageBox', //分页容器的id
            count:total, //总数据条数
            limit:q.pagesize, //每页显示几条数据
            curr:q.pagenum,
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],//设置默认被选中的分页
            jump:function(obj,first){
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // initTable()
                if(!first){
                    initTable()
                }
            }
        })
    }
    $('tbody').on('click','.btn-delete',function(){

        layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
            let len = $('.btn-delete').length
             let id = $(this).attr('data-id')

            $.ajax({
                method:'get',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')

                    if(len ===1){
                        q.pagenum === 1 ? 1 :q.pagesize - 1
                    }
                    initTable()
                }

            })
            layer.close(index)
        })
    })
})