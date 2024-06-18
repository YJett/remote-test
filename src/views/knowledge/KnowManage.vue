<template>
    <div>
        <el-header>
            <!-- Header content -->
            <el-switch v-model="switchValue"></el-switch>
            <el-input v-model="inputValue"></el-input>
            <el-button @click="showRelationDialog">关联实体</el-button>
            <el-button @click="showAddEntityDialog">添加实体</el-button>
            <el-button @click="showEditEntityDialog">修改实体</el-button>


<!--            <div v-if="selectedIdentity === 'sch'" class="school-input">-->
<!--                <Select v-model="selectedSchool" placeholder="请选择学校" style="width: 200px; font-size: 18px;">-->
<!--                    <Option v-for="opt in schools" :key="opt.value" :value="opt.value">{{ opt.label }}</Option>-->
<!--                </Select>-->
<!--            </div>-->

            <div class="sch-input">
                <Select v-model="selectedSchool" placeholder="请选择school" @on-change="handleSchChange"
                        style="width: 200px; font-size: 18px;">
                    <Option v-for="school in schools" :key="school.schId" :value="school.value">{{ school.label }}</Option>
                </Select>
            </div>

        </el-header>


        <div class="graph-container">
            <!-- Knowledge Graph -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>知识图谱</span>
                    <!-- Add tags to show node counts -->
                </div>
                <div class="el-card__body">
                    <div id="knowledge-graph" class="graph"></div>
                </div>
            </el-card>

            <!-- Skill Graph -->
<!--            <el-card class="box-card">-->
<!--                <div slot="header" class="clearfix">-->
<!--                    <span>技能图谱</span>-->
<!--                </div>-->
<!--                <div class="el-card__body">-->
<!--                    <div id="skill-graph" class="graph"></div>-->
<!--                </div>-->
<!--            </el-card>-->
        </div>

        <!-- Relation Dialog -->
        <el-dialog title="关联实体" :visible.sync="relationDialogVisible" width="30%" top="10vh">
            <el-form ref="relationForm" :model="relationForm" label-width="120px">
                <el-form-item label="实体1：知识图谱">
                    <el-input v-model="relationForm.entity1" disabled></el-input>
                </el-form-item>
<!--                <el-form-item label="实体2：技能图谱">-->
<!--                    <el-input v-model="relationForm.entity2" disabled></el-input>-->
<!--                </el-form-item>-->
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

const KNOWLEDGEANDSHIP = `MATCH (n:KnowledgePoint) OPTIONAL MATCH (n)-[r]->(m:KnowledgePoint) RETURN n, r, m`;
// const SKILLANDSHIP = `MATCH (n {type: 'skill'})-[r]->(m {type: 'skill'}) RETURN n, r, m`;
import {fetchAllSchools} from '@/api/schmanage';
import {Message} from "view-design";

export default {
    data() {
        return {
            selectedIdentity: 'sch',
            selectedSchool: '',
            selectedSchName: '',
            schools: [],
            switchValue: false,
            inputValue: "",
            currentClickNodeKnowledge: null,
            // currentClickNodeSkill: null,
            allNodeTypesCount: 0,
            knowledgeUnitCount: 0,
            knowledgeGraphCount: 0,
            knowledgeObjectCount: 0,
            topicKnowledgePointCount: 0,
            nodeTypeCounts: {
                knowledgeUnit: 0,
                knowledgeGraph: 0,
                knowledgeObject: 0,
                topicKnowledgePoint: 0
            },
            knowledgeGraphData: {
                nodes: [
                    { id: "node1", label: "Node 1" },
                    { id: "node2", label: "Node 2" },
                    { id: "node3", label: "Node 3" }
                ],
                edges: [
                    {
                        source: "node1",
                        target: "node2",
                        label: "This is edge1" // Set the edge name here
                    },
                    {
                        source: "node2",
                        target: "node3",
                        label: "This is edge1" // Set the edge name here
                    }
                ]
            },
            // skillGraphData: {
            //     nodes: [
            //         { id: "nodeA", label: "Node A" },
            //         { id: "nodeB", label: "Node B" },
            //         { id: "nodeC", label: "Node C" }
            //     ],
            //     edges: [
            //         { source: "nodeA", target: "nodeB" },
            //         { source: "nodeB", target: "nodeC" }
            //     ]
            // },
            relationDialogVisible: false,
            relationForm: {
                entity1: "",
                entity2: "",
                relationName: "",
                direction: "正向关系"
            },
            knowledgeGraph: null,
            // skillGraph: null
        };
    },
    created() {
        // this.fetchSchools();
    },
    async mounted() {
        this.fetchSchools()
        this.initKnowledgeGraph(); // 初始化知识图谱
        // this.initSkillGraph(); // 初始化技能图谱
       // this.fetchKnowledgeGraphData(); // 获取知识图谱数据
        // this.fetchSkillGraphData(); // 获取技能图谱数据
    },
    methods: {
        fetchSchools() {
            fetchAllSchools()
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.schools = response.data.map(school => ({
                            value: school.schId,
                            label: school.schName
                        }));
                        console.log(this.schools[0].value);
                        this.selectedSchool = this.schools[0].value;
                        this.selectedSchName = this.schools[0].label;
                    } else {
                        Message.error('Failed to fetch schools: Invalid data format');
                    }
                }).then(() => {
                    this.fetchKnowledgeGraphData();
                })
                .catch(error => {
                    Message.error('Failed to fetch schools');
                });
        },
        handleSchChange(schId) {
            console.log(schId);
            this.selectedSchool = schId;
            this.fetchKnowledgeGraphData();
        },
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
        async fetchKnowledgeGraphData() {
            let cypherQuery = `MATCH (n:KnowledgePoint)-[r]->(m:KnowledgePoint) RETURN n, r, m LIMIT 100`; // 默认查询
            console.log(this.selectedSchool)
            // 如果提供了 参数，修改查询语句以包含 jobId 条件
            if (this.selectedSchool) {
                cypherQuery = `MATCH (n:KnowledgePoint {schId: ${this.selectedSchool}}) OPTIONAL MATCH (n)-[r]->(m:KnowledgePoint) RETURN n, r, m`;
            }

            try {
                const res = await kgBuilderApi.getCypherResult(cypherQuery);
                // 处理查询结果，更新技能图谱数据
                let allNodes = res.data.node.map(node => ({
                    id: node.uuid,
                    label: node.knowledgeNm,
                    ...node
                }));
                let allEdges = res.data.relationship.map(rel => ({
                    source: rel.sourceId,
                    target: rel.targetId,
                    uuid: rel.uuid,
                    label: rel.type,
                }));
                this.allNodes = allNodes;
                this.allEdges = allEdges;
                this.knowledgeGraphData = {
                    nodes:allNodes,
                    edges:allEdges
                };
                console.log(this.knowledgeGraphData)
                this.knowledgeGraph.changeData(this.knowledgeGraphData);
            } catch (error) {
                console.error('获取技能图谱数据时出错：', error);
            }
        },
        // async fetchSkillGraphData() {
        //     // Fetch data from backend here for the skill graph
        //     // For now, we'll just use some dummy data
        //     // let cypher = `MATCH (n) RETURN n LIMIT 25`;
        //     // kgBuilderApi.getCypherResult(cypher).then((res) => {
        //     //     console.log(res);
        //     // });
        //     kgBuilderApi.getCypherResult(SKILLANDSHIP).then(res => {
        //         console.log(res);
        //         let nodes = res.data.node.map(node => ({
        //             id: node.uuid,
        //             label: node.name,
        //             ...node
        //         }));
        //         let edges = response.data.relationship.map(rel => ({
        //             source: rel.sourceId,
        //             target: rel.targetId,
        //             uuid: rel.uuid
        //         }));
        //
        //         this.skillGraphData = {
        //             nodes,
        //             edges
        //         };
        //         this.skillGraph.changeData(this.skillGraphData);
        //     });
        // },
        initKnowledgeGraph() {
            const menu = new G6.Menu({
                getContent(evt) {
                    return `<ul>
                    <li title='addChild'>Add Child Node</li>
                    </ul>`;
                },
                handleMenuClick(target, item) {
                    if (target.title === 'addChild') {
                        console.log(`Add child node for ${item.getID()}`);
                        console.log(item.getModel());
                        // Here you can add your logic to add a child node
                    }
                },
            });


            const knowledgeGraph = new G6.Graph({
                container: "knowledge-graph",
                layout: {
                    type: 'random',
                    preventOverlap: true,
                    gpuEnabled: true,
                    workerEnabled: true, // 启用 Web Worker

                    linkDistance: 50, // 增加这个值可以使节点间距离更大
                    preventOverlapPadding: 10 // 增加这个值可以使节点间距离更大
                },
                defaultNode: {
                    size: [100, 100], // 改变节点大小
                    style: {
                        fill: "#87CEEB", // 天空蓝填充
                        stroke: "#0F52BA" // 宝石蓝描边
                    },
                    labelCfg: {
                        style: {
                            fill: "#000",
                            fontSize: 14 // 改变标签字体大小
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
                plugins: [menu]
            });
            knowledgeGraph.data(this.knowledgeGraphData);
            knowledgeGraph.render();

            knowledgeGraph.on("node:click", e => {
                const nodeItem = e.item;
                this.currentClickNodeKnowledge = {
                    graph: "knowledge",
                    id: nodeItem.getModel().id
                };
            });
            knowledgeGraph.on("node:mouseenter", ev => {
                const nodeItem = ev.item;

                // Highlight the node itself
                knowledgeGraph.setItemState(nodeItem, "highlight", true);

                // Get the edges connected to the node
                const connectedEdges = nodeItem.getEdges();

                // Highlight the nodes at the other end of these edges
                connectedEdges.forEach(edge => {
                    const sourceNode = edge.getSource();
                    const targetNode = edge.getTarget();
                    const neighborNode = sourceNode === nodeItem ? targetNode : sourceNode;
                    knowledgeGraph.setItemState(neighborNode, "highlight", true);
                });
            });

            knowledgeGraph.on("node:mouseleave", ev => {
                // Clear all highlights
                this.clearStates(this.knowledgeGraph);
            });


            this.knowledgeGraph = knowledgeGraph;
        },
        updateGraph() {
            if (this.knowledgeGraph) {
                this.knowledgeGraph.changeData(this.knowledgeGraphData);
            }
        },
        filterNodeType(type) {
            // Clear the graph data
            this.knowledgeGraphData = {
                nodes: [],
                edges: []
            };

            // If 'all' is selected, fetch all data
            if (type === 'all') {
                this.fetchKnowledgeGraphData();
            } else {
                // Otherwise, fetch data for the specific node type
                let cypherQuery = `MATCH (n:${type}) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m`;
                kgBuilderApi.getCypherResult(cypherQuery).then(res => {
                    let nodes = res.data.node.map(node => ({
                        id: node.uuid,
                        label: node.knowledgeNm,
                        ...node
                    }));
                    let edges = res.data.relationship.map(rel => ({
                        source: rel.sourceId,
                        target: rel.targetId,
                        label: rel.type,
                        uuid: rel.uuid
                    }));
                    this.knowledgeGraphData = {
                        nodes,
                        edges
                    };
                    this.knowledgeGraph.changeData(this.knowledgeGraphData);
                });
            }
        },
        // initSkillGraph() {
        //     const skillGraph = new G6.Graph({
        //         container: "skill-graph",
        //         layout: {
        //             type: "force",
        //             preventOverlap: true
        //         },
        //         defaultNode: {
        //             size: [50, 50],
        //             style: {
        //                 fill: "#9EC9FF",
        //                 stroke: "#5B8FF9"
        //             },
        //             labelCfg: {
        //                 style: {
        //                     fill: "#000",
        //                     fontSize: 10
        //                 }
        //             }
        //         },
        //         nodeStateStyles: {
        //             selected: {
        //                 fill: "lightblue"
        //             }
        //         },
        //         modes: {
        //             default: ["drag-canvas", "zoom-canvas", "click-select", "drag-node"]
        //         }
        //     });
        //
        //     skillGraph.data(this.skillGraphData);
        //     skillGraph.render();
        //
        //     skillGraph.on("node:click", e => {
        //         const nodeItem = e.item;
        //         this.currentClickNodeSkill = {
        //             graph: "skill",
        //             id: nodeItem.getModel().id
        //         };
        //     });
        // },
        // Method to show relation dialog
        showRelationDialog() {
            if (this.currentClickNodeKnowledge) {
                this.relationForm.entity1 = JSON.stringify(this.currentClickNodeKnowledge);
                // this.relationForm.entity2 = JSON.stringify(this.currentClickNodeSkill);
                this.relationDialogVisible = true;
            } else {
                this.$message.error("请先选择知识图谱和技能图谱中的节点！");
            }
        },
        // Method to add relation
        addRelation() {
            // Logic to add relation
            this.relationDialogVisible = false;
            this.$message.success("成功添加关联关系！");
        },
        // Method to show add entity dialog
        showAddEntityDialog() {
            // Logic to show add entity dialog
            this.fetchKnowledgeGraphData();
            // this.fetchSkillGraphData();
            this.$message.info("添加实体功能暂未实现！");
        },
        // Method to show edit entity dialog
        showEditEntityDialog() {
            // Logic to show edit entity dialog
            this.$message.info("修改实体功能暂未实现！");
        },
        beforeDestroy() {
            // Destroy the knowledge graph and skill graph instances
            if (this.knowledgeGraph) {
                this.knowledgeGraph.destroy();
            }
            // if (this.skillGraph) {
            //     this.skillGraph.destroy();
            // }
        }
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
    white-space: nowrap; /* 防止内容换行 */
    overflow: visible; /* 确保内容可见 */
    text-overflow: ellipsis; /* 显示省略号 */
}

/* 移除省略号，确保所有内容可见 */
.el-tag .el-tag__close {
    text-overflow: clip;
}
</style>
