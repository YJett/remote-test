<template>
    <div>
        <el-header>
            <el-switch v-model="switchValue"></el-switch>
            <el-input v-model="inputValue"></el-input>
<!--            <el-button @click="showRelationDialog">关联实体</el-button>-->
<!--            <el-button @click="showAddEntityDialog">添加实体</el-button>-->
<!--            <el-button @click="showEditEntityDialog">修改实体</el-button>-->

            <div class="job-input">
                <Select v-model="selectedJobId" placeholder="请选择Job" @on-change="handleJobChange"
                    style="width: 200px; font-size: 18px;">
                    <Option v-for="job in jobs" :key="job.jobId" :value="job.value">{{ job.label }}</Option>
                </Select>
            </div>
        </el-header>

        <div class="graph-container">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>技能图谱</span>
                    <el-tag @click="filterNodeType('等级1')" style="cursor: pointer; margin-left: 10px;">等级1</el-tag>
                    <el-tag @click="filterNodeType('等级2')" style="cursor: pointer; margin-left: 10px;">等级2</el-tag>
                    <el-tag @click="filterNodeType('等级3')" style="cursor: pointer; margin-left: 10px;">等级3</el-tag>
                    <el-tag @click="filterNodeType('all')" style="cursor: pointer; margin-left: 10px;">所有类型</el-tag>
                </div>
                <div class="el-card__body">
                    <div id="skill-graph" class="graph"></div>
                </div>
            </el-card>
        </div>

        <el-dialog title="关联实体" :visible.sync="relationDialogVisible" width="30%" top="10vh">
            <el-form ref="relationForm" :model="relationForm" label-width="120px">
                <el-form-item label="实体2：技能图谱">
                    <el-input v-model="relationForm.entity2" disabled></el-input>
                </el-form-item>
                <el-form-item label="关系名称">
                    <el-input v-model="relationForm.relationName"></el-input>
                </el-form-item>
                <el-form-item label="关系方向">
                    <el-radio-group v-model="relationForm.direction">
                        <el-radio label="正向关系">正向关系</el-radio>
                        <el-radio label="逆向关系">逆向关系</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="relationDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addRelation">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import G6 from "@antv/g6";
import { kgBuilderApi } from "@/api";
import { fetchAllJobs } from "@/api/Jobmanage";
import { Message } from "view-design";

const SKILLANDSHIP = `MATCH (n:Skill)-[r]->(m:Skill) RETURN n, r, m LIMIT 100`;

const lightColors = ["#8FE9FF", "#87EAEF", "#FFC9E3", "#A7C2FF", "#FFA1E3", "#FFE269", "#BFCFEE", "#FFA0C5", "#D5FF86"];
const darkColors = ["#7DA8FF", "#44E6C1", "#FF68A7", "#7F86FF", "#AE6CFF", "#FF5A34", "#5D7092", "#FF6565", "#6BFFDE"];
const uLightColors = ["#CFF6FF", "#BCFCFF", "#FFECF5", "#ECFBFF", "#EAD9FF", "#FFF8DA", "#DCE2EE", "#FFE7F0", "#EEFFCE"];
const uDarkColors = ["#CADBFF", "#A9FFEB", "#FFC4DD", "#CACDFF", "#FFD4F2", "#FFD3C9", "#EBF2FF", "#FFCBCB", "#CAFFF3"];
const gColors = [];
const unlightColorMap = new Map();
lightColors.forEach((lcolor, i) => {
    gColors.push("l(0) 0:" + lcolor + " 1:" + darkColors[i]);
    unlightColorMap.set(gColors[i], "l(0) 0:" + uLightColors[i] + " 1:" + uDarkColors[i]);
});
export default {
    data() {
        return {
            switchValue: false,
            inputValue: "",
            allNodes: [],
            allEdges: [],
            expandedNodes: {},
            currentClickNodeSkill: null,
            allNodeTypesCount: 0,
            skillUnitCount: 0,
            skillGraphCount: 0,
            skillObjectCount: 0,
            topicSkillPointCount: 0,
            nodeTypeCounts: {
                skillUnit: 0,
                skillGraph: 0,
                skillObject: 0,
                topicSkillPoint: 0
            },
            skillGraphData: {
                nodes: [
                    { id: "nodeA", label: "Node A" },
                    { id: "nodeB", label: "Node B" },
                    { id: "nodeC", label: "Node C" }
                ],
                edges: [
                    { source: "nodeA", target: "nodeB" },
                    { source: "nodeB", target: "nodeC" }
                ]
            },
            relationDialogVisible: false,
            relationForm: {
                entity1: "",
                entity2: "",
                relationName: "",
                direction: "正向关系"
            },
            selectedJobName: "",
            selectedJobId: "", // 存储当前选中的 jobId
            jobs: [],
            // knowledgeGraph: null,
            skillGraph: null
        };
    },
    created() {
        //    this.fetchJobs();
    },
    async mounted() {
        await this.fetchJobs();
        this.initSkillGraph(); // 初始化技能图谱
        //  await this.fetchSkillGraphData();
    },
    methods: {
        clearStates(graph) {
            graph.getNodes() &&
                graph.getNodes().forEach(item => {
                    if (
                        item.getStates().findIndex(node => {
                            return node === "highlight";
                        }) !== -1
                    ) {
                        graph.setItemState(item, "highlight", false);
                    }
                    if (
                        item.getStates().findIndex(node => {
                            return node === "dark";
                        }) !== -1
                    ) {
                        graph.setItemState(item, "dark", false);
                    }
                });
            graph.getEdges() &&
                graph.getEdges().forEach(item => {
                    if (
                        item.getStates().findIndex(edge => {
                            return edge === "highlight";
                        }) !== -1
                    ) {
                        graph.setItemState(item, "highlight", false);
                    }
                    if (
                        item.getStates().findIndex(edge => {
                            return edge === "dark";
                        }) !== -1
                    ) {
                        graph.setItemState(item, "dark", false);
                    }
                });
        },
        // 新增的方法，用于根据 level 筛选节点并更新图表
        filterAndRenderByLevel(level) {
            // 筛选出指定 level 的节点
            const filteredNodes = this.allNodes.filter(node => node.level === level);
            // 获取这些节点的 id 列表
            const nodeIds = filteredNodes.map(node => node.id);
            // 筛选与这些节点相关的边
            const filteredEdges = this.allEdges.filter(edge => nodeIds.includes(edge.source) && nodeIds.includes(edge.target));

            // 更新图表数据
            this.skillGraphData = {
                nodes: filteredNodes,
                edges: filteredEdges
            };

            // 渲染图表
            this.skillGraph.changeData(this.skillGraphData);
        },

        // async fetchJobPositions() {
        //     try {
        //         // 从数据库中获取已有的 Jobid
        //         const res = await kgBuilderApi.getJobPositions();
        //
        //         // 处理获取的数据，将其添加到 jobPositions 数组中
        //         if (res && res.data && Array.isArray(res.data)) {
        //             this.jobPositions = res.data.map(job => ({
        //                 jobId: job.jobId,
        //             }));
        //
        //             // 如果获取的数据不为空，则默认选中第一个 Jobid
        //             if (this.jobPositions.length > 0) {
        //                 this.selectedJobId = this.jobPositions[0].jobId;
        //             }
        //         }
        //     } catch (error) {
        //         console.error('获取 Jobid 数据时出错：', error);
        //     }
        // },

        fetchJobs() {
            fetchAllJobs()
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.jobs = response.data.map(job => ({
                            value: job.jobid,
                            label: job.jobname
                        }));
                        // console.log(this.jobs[0].value);
                        this.selectedJobId = this.jobs[0].value;
                        this.selectedJobName = this.jobs[0].label;
                        console.log(this.selectedJobId);
                        this.fetchSkillGraphData();
                    } else {
                        Message.error("Failed to fetch jobs: Invalid data format");
                    }
                })
                .catch(error => {
                    Message.error("Failed to fetch jobs");
                });
        },
        handleJobChange(jobId) {
            console.log(jobId);
            if (jobId === "all") {
                this.selectedJobId = "";
            } else {
                this.selectedJobId = jobId;
            }
            this.fetchSkillGraphData();
        },
        showChildNodes(node) {
            const nodeId = node.abilityNo;

            // 找到所有子节点
            const childNodes = this.allNodes.filter(n => n.upabilityId === nodeId);
            const childNodeIds = childNodes.map(n => n.id);

            // 找到所有相关的边，确保边的源节点和目标节点都在当前节点列表中
            const childEdges = this.allEdges.filter(
                edge =>
                    (childNodeIds.includes(edge.source) && this.skillGraphData.nodes.some(n => n.id === edge.target)) ||
                    (childNodeIds.includes(edge.target) && this.skillGraphData.nodes.some(n => n.id === edge.source))
            );

            // 合并新节点和边到现有数据中
            this.skillGraphData.nodes = [...this.skillGraphData.nodes, ...childNodes];
            this.skillGraphData.edges = [...this.skillGraphData.edges, ...childEdges];

            // 更新图表数据
            this.skillGraph.changeData(this.skillGraphData);

            // 记录节点的展开状态
            this.$set(this.expandedNodes, node.id, true);
        },
        collapseChildNodes(node) {
            const nodeId = node.abilityNo;

            // 找到所有子节点
            const childNodes = this.skillGraphData.nodes.filter(n => n.upabilityId === nodeId);
            const childNodeIds = childNodes.map(n => n.id);

            // 移除子节点及其相关的边
            this.skillGraphData.nodes = this.skillGraphData.nodes.filter(n => n.upabilityId !== nodeId);
            this.skillGraphData.edges = this.skillGraphData.edges.filter(
                edge => !childNodeIds.includes(edge.source) && !childNodeIds.includes(edge.target)
            );

            // 更新图表数据
            this.skillGraph.changeData(this.skillGraphData);

            // 更新节点的展开状态
            this.$set(this.expandedNodes, node.id, false);
        },
        async fetchSkillGraphData() {
            let cypherQuery = `MATCH (n:Skill)-[r]->(m:Skill) RETURN n, r, m LIMIT 100`; // 默认查询
            console.log(this.selectedJobId);
            // 如果提供了 参数，修改查询语句以包含 jobId 条件
            if (this.selectedJobId) {
                cypherQuery = `MATCH (n:Skill {jobId: ${this.selectedJobId}}) OPTIONAL MATCH (n)-[r]->(m:Skill) RETURN n, r, m`;
            }

            try {
                const res = await kgBuilderApi.getCypherResult(cypherQuery);
                // 处理查询结果，更新技能图谱数据
                let allNodes = res.data.node.map(node => ({
                    id: node.uuid,
                    label: node.abilityNm,
                    ...node
                }));
                let allEdges = res.data.relationship.map(rel => ({
                    source: rel.sourceId,
                    target: rel.targetId,
                    uuid: rel.uuid,
                    label: rel.type
                }));
                // 过滤出 level 为 1 或 level 为 2 的节点
                let nodes = allNodes.filter(node => node.level === 1 || node.level === 2);
                let nodeIds = nodes.map(node => node.id);
                // 确保筛选出的边的源节点和目标节点都在修改后的节点ID列表中
                let edges = allEdges.filter(edge => nodeIds.includes(edge.source) && nodeIds.includes(edge.target));
                // 手动添加 job 节点
                if (this.selectedJobId) {
                    const jobNode = {
                        id: `${this.selectedJobId}`,
                        label: this.selectedJobName,
                        jobId: this.selectedJobId,
                        level: 0 // job 节点的层级设为 0
                    };
                    allNodes.push(jobNode); // 将 job 节点添加到 allNodes 中
                    nodes.push(jobNode); // 将 job 节点添加到 nodes 中

                    // 将所有 level === 1 的节点作为 job 节点的子节点
                    nodes.forEach(node => {
                        if (node.level === 1) {
                            const newEdge = {
                                source: jobNode.id,
                                target: node.id,
                                label: "HAS_CHILD"
                            };
                            allEdges.push(newEdge); // 将新关系添加到 allEdges 中
                            edges.push(newEdge); // 将新关系添加到 edges 中
                        }
                    });
                }

                // 更新图表数据
                this.allNodes = allNodes;
                this.allEdges = allEdges;
                this.skillGraphData = {
                    nodes: nodes,
                    edges: edges
                };
                console.log(this.skillGraphData);
                this.skillGraph.changeData(this.skillGraphData);
            } catch (error) {
                console.error("获取技能图谱数据时出错：", error);
            }
        },

        updateGraph() {
            if (this.skillGraph) {
                this.skillGraph.changeData(this.skillGraphData);
            }
        },
        // 现有的 filterNodeType 方法，需稍作修改以调用新的 filterAndRenderByLevel 方法
        filterNodeType(type) {
            console.log('Selected Type:', type);
            if (type === '等级1') {
                this.filterAndRenderByLevel(1);
            } else if (type === '等级2') {
                this.filterAndRenderByLevel(2);
            } else if (type === '等级3') {
                this.filterAndRenderByLevel(3);
            } else if (type === 'all') {
                // 如果是 'all'，则显示所有节点和边
                this.skillGraphData = {
                    nodes: this.allNodes,
                    edges: this.allEdges
                };
                this.skillGraph.changeData(this.skillGraphData);
            }
        },

        initSkillGraph() {
            /*
            const menu = new G6.Menu({
                getContent(evt) {
                    return `<ul>
            <li title='addChild'>Add Child Node</li>
            </ul>`;
                },
                handleMenuClick(target, item) {
                    if (target.title === "addChild") {
                        console.log(`Add child node for ${item.getID()}`);
                        console.log(item.getModel());
                        // Here you can add your logic to add a child node
                    }
                }
            });
            */
            const skillGraph = new G6.Graph({
                container: "skill-graph",
                layout: {
                    type: "force",
                    preventOverlap: true,
                    workerEnabled: true, // 启用 Web Worker
                    gpuEnabled: true,
                    linkDistance: 250, // 增加这个值可以使节点间距离更大
                    preventOverlapPadding: 250 // 增加这个值可以使节点间距离更大
                },
                defaultNode: {
                    size: [100, 100],
                    style: {
                        fill: "#9EC9FF",
                        stroke: "#5B8FF9"
                    },
                    labelCfg: {
                        style: {
                            fill: "#000",
                            fontSize: 14
                        }
                    }
                },
                defaultEdge: {
                    style: {
                        stroke: "#F6BD16", // 改变边的颜色
                        lineWidth: 2 // 改变边的宽度
                    },
                    labelCfg: {
                        autoRotate: true // Label follows the edge direction
                    }
                },
                nodeStateStyles: {
                    selected: {
                        fill: "lightblue"
                    }
                },
                modes: {
                    default: ["drag-canvas", "zoom-canvas", "click-select", "drag-node"]
                },
              //  plugins: [menu]
            });
            const hierarchicalColors = [
                '#87CEEB', // Light Sky Blue (Level 1)
                '#1E90FF', // Bright Blue (Level 2)
                '#DCE2EE', // Deep Green (Level 3)
                '#8B0000', // Dark Red (Level 4)
            ];

            skillGraph.node((node) => {
                let colorIndex;
                if (node.level && node.level >= 1 && node.level <= 4) {
                    colorIndex = node.level - 1; // 直接将 level 映射到颜色数组的索引上
                } else {
                    colorIndex = 0; // 默认颜色
                }

                return {
                    id: node.id,
                    style: {
                        fill: hierarchicalColors[colorIndex],
                    },
                };
            });

            skillGraph.data(this.skillGraphData);
            skillGraph.render();

            skillGraph.on("node:click", e => {
                const nodeItem = e.item;
                const model = nodeItem.getModel();
                this.currentClickNodeSkill = {
                    graph: "skill",
                    id: model.id
                };
                console.log(model);
                // 判断节点是否已经展开
                if (this.expandedNodes[model.id]) {
                    // 如果已经展开，则收回子节点
                    this.collapseChildNodes(model);
                } else {
                    // 如果未展开，则展示子节点
                    this.showChildNodes(model);
                }
            });

            skillGraph.on("node:mouseenter", ev => {
                const nodeItem = ev.item;

                // Highlight the node itself
                skillGraph.setItemState(nodeItem, "highlight", true);

                // Get the edges connected to the node
                const connectedEdges = nodeItem.getEdges();

                // Highlight the nodes at the other end of these edges
                connectedEdges.forEach(edge => {
                    const sourceNode = edge.getSource();
                    const targetNode = edge.getTarget();
                    const neighborNode = sourceNode === nodeItem ? targetNode : sourceNode;
                    skillGraph.setItemState(neighborNode, "highlight", true);
                });
            });

            skillGraph.on("node:mouseleave", ev => {
                // Clear all highlights
                this.clearStates(this.skillGraph);
            });

            this.skillGraph = skillGraph;
        },

        // Method to show relation dialog
        // showRelationDialog() {
        //     if (this.currentClickNodeSkill) {
        //         // this.relationForm.entity1 = JSON.stringify(this.currentClickNodeKnowledge);
        //         this.relationForm.entity2 = JSON.stringify(this.currentClickNodeSkill);
        //         this.relationDialogVisible = true;
        //     } else {
        //         this.$message.error("请先选择知识图谱和技能图谱中的节点！");
        //     }
        // },
        // Method to add relation
        addRelation() {
            // Logic to add relation
            this.relationDialogVisible = false;
            this.$message.success("成功添加关联关系！");
        },
        // Method to show add entity dialog
        // showAddEntityDialog() {
        //     // Logic to show add entity dialog
        //     // this.fetchKnowledgeGraphData();
        //     this.fetchSkillGraphData();
        //     this.$message.info("添加实体功能暂未实现！");
        // },
        // Method to show edit entity dialog
        // showEditEntityDialog() {
        //     // Logic to show edit entity dialog
        //     this.$message.info("修改实体功能暂未实现！");
        // // },
        // beforeDestroy() {
        //     // Destroy the knowledge graph and skill graph instances
        //     // if (this.knowledgeGraph) {
        //     //     this.knowledgeGraph.destroy();
        //     // }
        //     if (this.skillGraph) {
        //         this.skillGraph.destroy();
        //     }
        // }
    }
};
</script>

<style>
.el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.el-card__body {
    height: 100%;
    /* Set the height of the card body */
}

.graph-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 80vh;
    /* Set the height of the container to 80% of the viewport height */
}

.box-card {
    margin: 10px;
    flex: 1;
}

.graph {
    height: 100%;
}

.el-tag {
    white-space: nowrap;
    /* 防止内容换行 */
    overflow: visible;
    /* 确保内容可见 */
    text-overflow: ellipsis;
    /* 显示省略号 */
}

/* 移除省略号，确保所有内容可见 */
.el-tag .el-tag__close {
    text-overflow: clip;
}
</style>
