<template>
    <el-card :body-style="{margin:'10px'}" :id="info.id"
        style="margin:5px 5px 0px 0px;height:290px;" >
        <div slot="header" class="header">
            <span style="">{{info.name}}</span>
            <span style="margin-left:auto;">{{info.sex}}</span>
        </div>
        <div class="content">
            <el-descriptions :column="1">
                <el-descriptions-item label="八字">{{info.bazi}}</el-descriptions-item>
                <el-descriptions-item label="出生日期">{{info.birthday}}</el-descriptions-item>
                <el-descriptions-item label="国籍">{{info.nation}}</el-descriptions-item>
                <el-descriptions-item label="出生地">{{info.birthplace}}</el-descriptions-item>
                <el-descriptions-item label="格局">
                    <el-tag size="small" v-for="item in info.geju" :key="item.val" style="margin-right:5px;margin-top:2px;">{{item.name}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="强弱">{{info.qiangruo}}</el-descriptions-item>
                <el-descriptions-item label="用神">{{info.yongshen}}</el-descriptions-item>
                <el-descriptions-item label="标签">{{info.tag}}</el-descriptions-item>
            </el-descriptions>
        </div>
        <el-divider></el-divider>
        <div class="footer">
            <el-link type="primary">详情</el-link>
            <span style="margin-left:auto;">{{info.source}}</span>
        </div>
    </el-card>
</template>

<script>
export default {
    name: "ml-panel",
    data() {
        return {
            
        }
    },
    props: {
        info: Object
    },
    created() {},
    mounted() {
    },
}
</script>
<style lang="less" scoped>
    .el-card /deep/ .el-card__header{
        height:30px;
        // background-color: yellowgreen;
        display: flex;
        align-items: center;
    }
    .el-card /deep/ .el-divider--horizontal{
        margin: 0px;
    }
    .el-card /deep/ .el-descriptions-item__container .el-descriptions-item__content, .el-descriptions-item__container .el-descriptions-item__label {
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        /* display: inline-flex; */
        -webkit-box-align: baseline;
        -ms-flex-align: baseline;
        align-items: baseline;
    }
    .header{
        display: flex;
        justify-content: flex-end;
        flex:2;
    }
    .content{
        height: 260px;
        overflow: auto;
    }
    .footer{
        display: flex;
        justify-content: flex-end;
        margin-top: 5px;
    }
</style>
