// 全局变量
let currentChart = 'line';
let dataStreamInterval = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCharts();
    showSection('home');
});

// 导航功能
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            showSection(target);
        });
    });
}

function showSection(sectionId) {
    // 隐藏所有部分
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 移除所有导航链接的活动状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 显示目标部分
    document.getElementById(sectionId).classList.add('active');
    
    // 设置对应的导航链接为活动状态
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
    
    // 如果是图表部分，确保显示当前图表
    if (sectionId === 'charts') {
        showChart(currentChart);
    }
}

// 图表初始化
function initializeCharts() {
    // 确保所有图表容器都有正确的高度
    const chartCanvases = document.querySelectorAll('.chart-canvas');
    chartCanvases.forEach(canvas => {
        canvas.style.height = '500px'; // 统一图表高度
        canvas.style.width = '100%'; // 确保宽度100%
    });
    
    // 初始化当前显示的图表
    createGmvChart();
}

// 图表切换功能
function showChart(chartType) {
    // 隐藏所有图表
    document.querySelectorAll('.chart').forEach(chart => {
        chart.classList.remove('active');
    });
    
    // 移除所有控制按钮的活动状态
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示目标图表
    document.getElementById(`${chartType}-chart`).classList.add('active');
    
    // 设置对应的控制按钮为活动状态
    document.querySelector(`[onclick="showChart('${chartType}')"]`).classList.add('active');
    
    // 初始化对应的图表
    switch(chartType) {
        case 'gmv':
            createGmvChart();
            break;
        case 'bar':
            createBarChart();
            break;
        case 'pie':
            createPieChart();
            break;
        case 'scatter':
            createScatterChart();
            break;
        case 'histogram':
            createHistogramChart();
            break;
        case 'jam':
            createJamChart();
            break;
    }
    
    currentChart = chartType;
}

// 阿里巴巴GMV数据图表 - 2013-2019财年淘宝和天猫平台GMV（统一比例显示）
function createGmvChart() {
    const chartDom = document.getElementById('gmv-chart-canvas');
    // 先清除之前的图表实例
    if (chartDom._echarts_instance) {
        echarts.dispose(chartDom);
    }
    const myChart = echarts.init(chartDom);
    
    // 基于第3章.ipynb实例5的GMV数据（单位：亿元）
    const years = ['FY2013', 'FY2014', 'FY2015', 'FY2016', 'FY2017', 'FY2018', 'FY2019'];
    const gmvData = [10770, 16780, 24440, 30920, 37670, 48200, 57270];
    
    // 计算标准化比例（与其他实例保持一致）
    const maxValue = Math.max(...gmvData);
    const minValue = Math.min(...gmvData);
    const dataRange = maxValue - minValue;
    
    // 统一网格布局（与其他实例保持一致）
    const option = {
        title: {
            text: '2013-2019财年阿里巴巴淘宝和天猫平台GMV',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333'
            },
            top: '2%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const year = params[0].axisValue;
                const gmv = params[0].value;
                const percentage = ((gmv - minValue) / dataRange * 100).toFixed(1);
                return `${year}<br>GMV: ${gmv}亿元<br>相对比例: ${percentage}%`;
            }
        },
        grid: {
            left: '8%',
            right: '5%',
            bottom: '10%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: years,
            axisLabel: {
                fontSize: 12,
                color: '#666',
                interval: 0,
                rotate: 0
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc',
                    width: 1
                }
            },
            axisTick: {
                alignWithLabel: true,
                length: 4
            }
        },
        yAxis: {
            type: 'value',
            name: 'GMV(亿元)',
            nameLocation: 'end',
            nameGap: 15,
            nameTextStyle: {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#333'
            },
            axisLabel: {
                fontSize: 11,
                color: '#666',
                formatter: function(value) {
                    if (value >= 10000) {
                        return (value / 10000).toFixed(1) + '万亿';
                    }
                    return value;
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#ccc',
                    width: 1
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed',
                    width: 1
                }
            },
            min: 0,
            max: Math.ceil(maxValue / 10000) * 10000, // 统一向上取整到万亿级别
            interval: 10000 // 统一间隔为1万亿
        },
        series: [
            {
                name: 'GMV',
                type: 'bar',
                data: gmvData,
                barWidth: '40%', // 统一柱状图宽度比例
                itemStyle: {
                    color: '#1890ff',
                    borderRadius: [2, 2, 0, 0]
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: function(params) {
                        const value = params.value;
                        if (value >= 10000) {
                            return (value / 10000).toFixed(1) + '万亿';
                        }
                        return value + '亿';
                    },
                    fontSize: 11,
                    fontWeight: 'bold',
                    color: '#333'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                }
            }
        ]
    };
    
    myChart.setOption(option);
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 柱状图 - 基于第3章.ipynb实例2：2019年电影票房排行（统一比例显示）
function createBarChart() {
    const chartDom = document.getElementById('bar-chart-canvas');
    // 先清除之前的图表实例
    if (chartDom._echarts_instance) {
        echarts.dispose(chartDom);
    }
    const myChart = echarts.init(chartDom);
    
    // 基于第3章.ipynb的电影票房数据
    const labels = [
        "哪吒之魔童降世", "流浪地球", "复仇者联盟4:终局之战", 
        "疯狂的外星人", "飞驰人生", "烈火英雄", "蜘蛛侠:英雄远征", 
        "速度与激情:特别行动", "扫毒2天地对决", "大黄蜂", "惊奇队长", 
        "比悲伤更悲伤的故事", "哥斯拉2:怪兽之王", "阿丽塔:战斗天使", 
        "银河补习班"
    ];
    
    const barWidth = [48.57, 46.18, 42.05, 21.83, 17.03, 16.70, 14.01, 13.84, 
                     12.85, 11.38, 10.25, 9.46, 9.27, 8.88, 8.64];
    
    // 计算标准化比例
    const maxValue = Math.max(...barWidth);
    const minValue = Math.min(...barWidth);
    const dataRange = maxValue - minValue;
    
    const option = {
        title: {
            text: '2019年内地电影票房排行榜',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const movie = params[0].name;
                const boxOffice = params[0].value;
                const percentage = ((boxOffice - minValue) / dataRange * 100).toFixed(1);
                return `${movie}<br>票房: ${boxOffice}亿元<br>相对比例: ${percentage}%`;
            }
        },
        grid: {
            left: '20%',
            right: '5%',
            bottom: '10%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: '总票房(亿元)',
            nameLocation: 'end',
            nameGap: 15,
            axisLabel: {
                formatter: '{value}亿'
            },
            min: 0,
            max: Math.ceil(maxValue / 10) * 10, // 统一向上取整到10亿级别
            interval: 10 // 统一间隔为10亿
        },
        yAxis: {
            type: 'category',
            data: labels,
            axisLabel: {
                interval: 0,
                fontSize: 10,
                formatter: function(value) {
                    if (value.length > 8) {
                        return value.substring(0, 8) + '...';
                    }
                    return value;
                }
            }
        },
        series: [
            {
                name: '票房',
                type: 'bar',
                data: barWidth,
                barWidth: '60%', // 统一柱状图宽度比例
                itemStyle: {
                    color: function(params) {
                        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
                                      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'];
                        return colors[params.dataIndex % colors.length];
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}亿'
                }
            }
        ]
    };
    
    myChart.setOption(option);
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 饼图 - 基于第3章.ipynb实例3：支付宝月账单报告
function createPieChart() {
    const chartDom = document.getElementById('pie-chart-canvas');
    // 先清除之前的图表实例
    if (chartDom._echarts_instance) {
        echarts.dispose(chartDom);
    }
    const myChart = echarts.init(chartDom);
    
    // 基于第3章.ipynb的支付宝月账单数据
    const kinds = ['购物', '人情往来', '餐饮美食', '通信物流', '生活日用', '交通出行', '休闲娱乐', '其他'];
    const money_scale = [800 / 3000, 100 / 3000, 1000 / 3000, 200 / 3000, 
                        300 / 3000, 200 / 3000, 200 / 3000, 200 / 3000];
    
    // 转换为实际金额
    const data = kinds.map((kind, index) => ({
        name: kind,
        value: money_scale[index] * 3000
    }));
    
    const option = {
        title: {
            text: '支付宝月账单报告',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                const percent = (params.value / 3000 * 100).toFixed(1);
                return `${params.name}<br>金额: ${params.value}元<br>占比: ${percent}%`;
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: '15%',
            textStyle: {
                fontSize: 10
            }
        },
        series: [
            {
                name: '消费分类',
                type: 'pie',
                radius: ['30%', '60%'],
                center: ['60%', '50%'],
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    formatter: '{b}: {d}%'
                }
            }
        ]
    };
    
    myChart.setOption(option);
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 散点图 - 基于第3章.ipynb实例4：汽车速度与制动距离的关系（统一比例显示）
function createScatterChart() {
    const chartDom = document.getElementById('scatter-chart-canvas');
    // 先清除之前的图表实例
    if (chartDom._echarts_instance) {
        echarts.dispose(chartDom);
    }
    const myChart = echarts.init(chartDom);
    
    // 基于第3章.ipynb的汽车制动距离数据
    const x_speed = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
    const y_distance = [0.5, 2.0, 4.4, 7.9, 12.3, 17.7, 24.1, 31.5, 39.9, 49.2,
                       59.5, 70.8, 83.1, 96.4, 110.7, 126.0, 142.2, 159.4, 177.6, 196.8];
    
    const data = x_speed.map((speed, index) => [speed, y_distance[index]]);
    
    // 计算标准化比例
    const maxX = Math.max(...x_speed);
    const minX = Math.min(...x_speed);
    const maxY = Math.max(...y_distance);
    const minY = Math.min(...y_distance);
    
    const option = {
        title: {
            text: '汽车速度与制动距离的关系',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(param) {
                const speed = param.value[0];
                const distance = param.value[1];
                const xPercentage = ((speed - minX) / (maxX - minX) * 100).toFixed(1);
                const yPercentage = ((distance - minY) / (maxY - minY) * 100).toFixed(1);
                return `速度: ${speed}km/h (${xPercentage}%)<br>制动距离: ${distance}m (${yPercentage}%)`;
            }
        },
        grid: {
            left: '8%',
            right: '5%',
            bottom: '10%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: '速度(km/h)',
            nameLocation: 'end',
            nameGap: 15,
            min: 0,
            max: Math.ceil(maxX / 50) * 50, // 统一向上取整到50km/h级别
            interval: 50 // 统一间隔为50km/h
        },
        yAxis: {
            type: 'value',
            name: '制动距离(m)',
            nameLocation: 'end',
            nameGap: 15,
            min: 0,
            max: Math.ceil(maxY / 50) * 50, // 统一向上取整到50m级别
            interval: 50 // 统一间隔为50m
        },
        series: [{
            type: 'scatter',
            data: data,
            symbolSize: 8,
            itemStyle: {
                color: '#ff6b6b'
            },
            markLine: {
                data: [
                    { type: 'average', name: '平均值', xAxis: 'average' },
                    { type: 'average', name: '平均值', yAxis: 'average' }
                ]
            }
        }]
    };
    
    myChart.setOption(option);
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 直方图 - 基于第3章.ipynb实例5：英语成绩对比（统一比例显示）
function createHistogramChart() {
    const chartDom = document.getElementById('histogram-chart-canvas');
    // 先清除之前的图表实例
    if (chartDom._echarts_instance) {
        echarts.dispose(chartDom);
    }
    const myChart = echarts.init(chartDom);
    
    // 基于第3章.ipynb的英语成绩数据
    const men_means = [90.5, 89.5, 88.7, 88.5, 85.2, 86.6];
    const women_means = [92.7, 87.0, 90.5, 85.0, 89.5, 89.8];
    const classes = ['高二1班', '高二2班', '高二3班', '高二4班', '高二5班', '高二6班'];
    
    // 计算标准化比例
    const allScores = [...men_means, ...women_means];
    const maxScore = Math.max(...allScores);
    const minScore = Math.min(...allScores);
    const scoreRange = maxScore - minScore;
    
    const option = {
        title: {
            text: '高二各班男生、女生英语平均成绩',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const classIndex = params[0].dataIndex;
                const menScore = men_means[classIndex];
                const womenScore = women_means[classIndex];
                const menPercentage = ((menScore - minScore) / scoreRange * 100).toFixed(1);
                const womenPercentage = ((womenScore - minScore) / scoreRange * 100).toFixed(1);
                return `${classes[classIndex]}<br>男生: ${menScore}分 (${menPercentage}%)<br>女生: ${womenScore}分 (${womenPercentage}%)`;
            }
        },
        legend: {
            data: ['男生平均成绩', '女生平均成绩'],
            top: '10%'
        },
        grid: {
            left: '8%',
            right: '5%',
            bottom: '10%',
            top: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: classes,
            axisLabel: {
                interval: 0,
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            name: '分数',
            min: Math.floor(minScore / 5) * 5, // 统一向下取整到5分级别
            max: Math.ceil(maxScore / 5) * 5,  // 统一向上取整到5分级别
            interval: 5 // 统一间隔为5分
        },
        series: [
            {
                name: '男生平均成绩',
                type: 'bar',
                data: men_means,
                barWidth: '30%', // 统一柱状图宽度比例
                itemStyle: {
                    color: '#5470c6'
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}分'
                }
            },
            {
                name: '女生平均成绩',
                type: 'bar',
                data: women_means,
                barWidth: '30%', // 统一柱状图宽度比例
                itemStyle: {
                    color: '#91cc75'
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}分'
                }
            }
        ]
    };
    
    myChart.setOption(option);
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 果酱面包配料比例图表
function createJamChart() {
    const chartDom = document.getElementById('jam-chart-canvas');
    // 先清除之前的图表实例
    if (chartDom._echarts_instance) {
        echarts.dispose(chartDom);
    }
    const myChart = echarts.init(chartDom);
    
    // 果酱面包配料比例数据
    const ingredients = ['面粉', '果酱', '糖', '黄油', '酵母', '盐', '水'];
    const percentages = [45, 20, 15, 10, 5, 2, 3];
    
    const option = {
        title: {
            text: '果酱面包配料比例',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: '15%',
            data: ingredients
        },
        series: [
            {
                name: '配料比例',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['60%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: ingredients.map((name, index) => ({
                    value: percentages[index],
                    name: name,
                    itemStyle: {
                        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'][index]
                    }
                }))
            }
        ]
    };
    
    myChart.setOption(option);
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 数据流图表
function createStreamChart() {
    const chartDom = document.getElementById('stream-chart');
    const myChart = echarts.init(chartDom);
    
    const base = +new Date(2024, 0, 1);
    const oneDay = 24 * 3600 * 1000;
    const data = [[base, Math.random() * 100]];
    
    for (let i = 1; i < 50; i++) {
        const now = new Date(base + i * oneDay);
        data.push([+now, Math.random() * 100]);
    }
    
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const date = new Date(params[0].value[0]);
                return date.getDate() + '/' + (date.getMonth() + 1) + ': ' + params[0].value[1].toFixed(2);
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'time',
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            data: data,
            lineStyle: {
                color: '#5470c6'
            },
            areaStyle: {
                color: 'rgba(84, 112, 198, 0.3)'
            }
        }]
    };
    
    myChart.setOption(option);
    return myChart;
}

// 交互功能
function updateGmvChart(type) {
    const chartDom = document.getElementById('gmv-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    
    if (type === 'trend') {
        // 趋势分析 - 切换显示/隐藏趋势线
        const option = myChart.getOption();
        const isTrendVisible = option.series[1].lineStyle.opacity !== 0;
        
        if (isTrendVisible) {
            // 隐藏趋势线
            option.series[1].lineStyle.opacity = 0;
            option.series[1].itemStyle.opacity = 0;
            option.series[1].label.show = false;
            option.series[1].areaStyle.opacity = 0;
        } else {
            // 显示趋势线
            option.series[1].lineStyle.opacity = 1;
            option.series[1].itemStyle.opacity = 1;
            option.series[1].label.show = true;
            option.series[1].areaStyle.opacity = 0.3;
        }
        
        myChart.setOption(option);
    } else if (type === 'growth') {
        // 增长率分析 - 切换显示/隐藏增长率图表
        const option = myChart.getOption();
        const isGrowthVisible = option.grid[1].top !== '100%';
        
        if (isGrowthVisible) {
            // 隐藏增长率图表
            option.grid[1].top = '100%';
            option.grid[1].bottom = '100%';
            option.xAxis[1].show = false;
            option.yAxis[1].show = false;
            option.series[1].show = false;
        } else {
            // 显示增长率图表
            option.grid[1].top = '75%';
            option.grid[1].bottom = '5%';
            option.xAxis[1].show = true;
            option.yAxis[1].show = true;
            option.series[1].show = true;
        }
        
        myChart.setOption(option);
    }
}

function resetGmvChart() {
    const chartDom = document.getElementById('gmv-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    createGmvChart();
}

function updateBarChart(type) {
    const chartDom = document.getElementById('bar-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    
    if (type === 'sort') {
        // 排序功能
        const option = myChart.getOption();
        const seriesData = option.series[0].data;
        const indices = seriesData.map((val, idx) => idx);
        indices.sort((a, b) => seriesData[b] - seriesData[a]);
        
        const newXData = indices.map(idx => option.xAxis[0].data[idx]);
        const newSeriesData = indices.map(idx => seriesData[idx]);
        
        option.xAxis[0].data = newXData;
        option.series[0].data = newSeriesData;
        myChart.setOption(option);
    } else if (type === 'animate') {
        // 动画效果
        const option = myChart.getOption();
        option.series[0].data = option.series[0].data.map(val => val + Math.random() * 20 - 10);
        myChart.setOption(option);
    }
}

function resetBarChart() {
    const chartDom = document.getElementById('bar-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    createBarChart();
}

function updatePieChart(type) {
    const chartDom = document.getElementById('pie-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    
    if (type === 'explode') {
        // 分离效果
        const option = myChart.getOption();
        option.series[0].radius = ['30%', '70%'];
        myChart.setOption(option);
    } else if (type === 'rotate') {
        // 旋转效果
        const option = myChart.getOption();
        option.series[0].startAngle = (option.series[0].startAngle || 0) + 45;
        myChart.setOption(option);
    }
}

function resetPieChart() {
    const chartDom = document.getElementById('pie-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    createPieChart();
}

function updateScatterChart(type) {
    const chartDom = document.getElementById('scatter-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    
    if (type === 'size') {
        // 调整大小
        const option = myChart.getOption();
        option.series[0].symbolSize = function(val) {
            return val[2] / 3;
        };
        myChart.setOption(option);
    } else if (type === 'color') {
        // 调整颜色
        const option = myChart.getOption();
        const colors = ['#ee6666', '#fac858', '#73c0de', '#3ba272', '#9a60b4'];
        option.series[0].itemStyle.color = function(params) {
            return colors[params.dataIndex % colors.length];
        };
        myChart.setOption(option);
    }
}

function resetScatterChart() {
    const chartDom = document.getElementById('scatter-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    createScatterChart();
}

function updateHistogram(type) {
    const chartDom = document.getElementById('histogram-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    
    if (type === 'bins') {
        // 调整分组
        const option = myChart.getOption();
        const newBins = 5;
        const binSize = 100 / newBins;
        const newData = [];
        
        for (let i = 0; i < newBins; i++) {
            newData.push(0);
        }
        
        // 重新计算频数（这里简化处理）
        option.series[0].data = newData.map((_, i) => Math.random() * 200 + 50);
        option.xAxis[0].data = Array.from({length: newBins}, (_, i) => 
            `${i * binSize}-${(i + 1) * binSize}`
        );
        myChart.setOption(option);
    } else if (type === 'data') {
        // 更新数据
        const option = myChart.getOption();
        option.series[0].data = option.series[0].data.map(() => Math.random() * 200 + 50);
        myChart.setOption(option);
    }
}

function resetHistogram() {
    const chartDom = document.getElementById('histogram-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    createHistogramChart();
}

function updateRadarChart(type) {
    const chartDom = document.getElementById('radar-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    
    if (type === 'add') {
        // 添加数据
        const option = myChart.getOption();
        const newData = {
            value: Array.from({length: 6}, () => Math.random() * 50 + 50),
            name: '员工' + String.fromCharCode(65 + option.series[0].data.length),
            areaStyle: {
                color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`
            },
            lineStyle: {
                color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
            }
        };
        option.series[0].data.push(newData);
        myChart.setOption(option);
    } else if (type === 'remove') {
        // 移除数据
        const option = myChart.getOption();
        if (option.series[0].data.length > 1) {
            option.series[0].data.pop();
            myChart.setOption(option);
        }
    }
}

function updateJamChart(type) {
    const chartDom = document.getElementById('jam-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    
    if (type === 'nutrition') {
        // 营养成分分析
        const option = myChart.getOption();
        const nutritionData = [
            {name: '碳水化合物', value: 60},
            {name: '蛋白质', value: 15},
            {name: '脂肪', value: 20},
            {name: '纤维素', value: 3},
            {name: '维生素', value: 2}
        ];
        
        option.series[0].data = nutritionData.map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
                color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][index]
            }
        }));
        option.legend[0].data = nutritionData.map(item => item.name);
        option.title[0].text = '果酱面包营养成分分析';
        
        myChart.setOption(option);
    } else if (type === 'calories') {
        // 热量分析
        const option = myChart.getOption();
        const calorieData = [
            {name: '面粉', value: 250},
            {name: '果酱', value: 80},
            {name: '糖', value: 60},
            {name: '黄油', value: 150},
            {name: '其他', value: 60}
        ];
        
        option.series[0].data = calorieData.map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
                color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][index]
            }
        }));
        option.legend[0].data = calorieData.map(item => item.name);
        option.title[0].text = '果酱面包热量分布';
        
        myChart.setOption(option);
    }
}

function resetJamChart() {
    const chartDom = document.getElementById('jam-chart-canvas');
    const myChart = echarts.getInstanceByDom(chartDom);
    createJamChart();
}

// 数据流功能
function startDataStream() {
    const myChart = createStreamChart();
    
    if (dataStreamInterval) {
        clearInterval(dataStreamInterval);
    }
    
    dataStreamInterval = setInterval(function() {
        const option = myChart.getOption();
        const oldData = option.series[0].data;
        const now = new Date();
        const newValue = Math.random() * 100;
        
        oldData.shift();
        oldData.push([+now, newValue]);
        
        myChart.setOption({
            series: [{
                data: oldData
            }]
        });
    }, 1000);
}

function stopDataStream() {
    if (dataStreamInterval) {
        clearInterval(dataStreamInterval);
        dataStreamInterval = null;
    }
}

// 导出功能
function exportData(format) {
    let data = '';
    let filename = 'chart_data';
    
    switch (format) {
        case 'png':
            // 这里简化处理，实际应该使用图表库的导出功能
            alert('PNG导出功能需要后端支持');
            return;
        case 'csv':
            data = 'x,y\n1,10\n2,20\n3,30\n4,40\n5,50';
            filename += '.csv';
            break;
        case 'json':
            data = JSON.stringify({x: [1,2,3,4,5], y: [10,20,30,40,50]}, null, 2);
            filename += '.json';
            break;
    }
    
    const blob = new Blob([data], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 响应式调整
window.addEventListener('resize', function() {
    // 重新调整所有图表大小
    const chartDoms = document.querySelectorAll('.chart-canvas, .mini-chart');
    chartDoms.forEach(dom => {
        const chart = echarts.getInstanceByDom(dom);
        if (chart) {
            chart.resize();
        }
    });
});