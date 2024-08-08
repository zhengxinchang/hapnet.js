# TODO

## 2022年10月11日

- take meta -> hover data to toolTip
- 


# Outline

## API

### HapNet类

#### init()

初始化HapNet类

##### 参数

###### option

类型：Object

属性：

```{javascript}
{
    el: string , // Dd of the DOM element
    width: number, // Width of the plot area
    height: number, // Height of the plot area
}
```

#### registerPalette()

注册新的palette

### HapNet实例

#### setOption()

设置绘图配置对象

#### getOption()

获得绘图配置对象

#### getWdith()

获取图的宽度

#### getHeight()

获取图的高度

#### getDom()

获取绘图DOM

#### getCanvas()

活得Canvas绘图实例

#### resize()

手动触发resize

#### showLoading()

显示加载动画效果。可以在加载数据前手动调用该接口显示加载动画，在数据加载完成后调用 hideLoading 隐藏加载动画。

#### hideLoading()

隐藏动画加载效果。

#### clear()

清空当前实例，会移除实例中所有的组件和图表。

## Event

### Click node

高亮被选中的node，并且第一集关联的link和对应的另一端的node

### click link

高亮被选中的link，并且高亮link所连接的两个node

### hover node

hover node的时候弹出
**hoverBox的行为：**
hover node的时候在鼠标的坐标弹出，点击的时候消失。如果鼠标移动到box内部，则点击不消失。
超出长度显示支持滚动


