<template>
    <div>
        <el-header>
            <!-- Header content -->
            <el-switch v-model="switchValue"></el-switch>
            <el-input v-model="inputValue"></el-input>

            <div class="sch-input">
                <Select v-model="selectedSchool" placeholder="请选择school" @on-change="handleSchChange"
                        style="width: 200px; font-size: 18px;">
                    <Option v-for="school in schools" :key="school.schId" :value="school.value">{{ school.label }}</Option>
                </Select>
            </div>
        </el-header>

        <div class="graph-container">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>知识图谱</span>
                </div>
                <div class="el-card__body">
                    <div id="knowledge-graph" class="graph"></div>
                    <!-- 条件渲染：当数据为空时显示提示 -->
                    <div v-if="!knowledgeGraphData || knowledgeGraphData.nodes.length === 0" class="empty-message">
                        暂无数据
                    </div>
                </div>
            </el-card>
        </div>

        <!-- Relation Dialog -->
        <el-dialog title="关联实体" :visible.sync="relationDialogVisible" width="30%" top="10vh">
            <el-form ref="relationForm" :model="relationForm" label-width="120px">
                <el-form-item label="实体1：知识图谱">
                    <el-input v-model="relationForm.entity1" disabled></el-input>
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
import { fetchAllSchools } from '@/api/schmanage';
import { Message } from "view-design";

const KNOWLEDGEANDSHIP = `MATCH (n:KnowledgePoint) OPTIONAL MATCH (n)-[r]->(m:KnowledgePoint) RETURN n, r, m`;

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
            knowledgeGraphData: { nodes: [], edges: [] }, // 初始化为空数据
            relationDialogVisible: false,
            relationForm: {
                entity1: "",
                entity2: "",
                relationName: "",
                direction: "正向关系"
            },
            knowledgeGraph: null,
        };
    },
    created() {
        // this.fetchSchools();
    },
    async mounted() {
        await this.fetchSchools(); // 等待学校数据加载完成
        this.initKnowledgeGraph(); // 初始化图表
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
                        console.log(this.selectedSchool);
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
            console.log("fetch knowledge data current is " + this.selectedSchool);
            if (this.selectedSchool) {
                cypherQuery = `MATCH (n:KnowledgePoint {schId: ${this.selectedSchool}}) OPTIONAL MATCH (n)-[r]->(m:KnowledgePoint) RETURN n, r, m`;
            }

            try {
                const res = await kgBuilderApi.getCypherResult(cypherQuery);

                // 检查 res.data 是否为空
                if (!res.data || (!res.data.node && !res.data.relationship)) {
                    console.log("后端返回数据为空，清空图表");
                    this.knowledgeGraphData = { nodes: [], edges: [] };
                    this.knowledgeGraph.changeData(this.knowledgeGraphData);
                    return;
                }

                // 如果数据不为空，正常处理
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

                this.knowledgeGraphData = {
                    nodes: allNodes,
                    edges: allEdges
                };
                console.log("获取到的知识节点数据是 " + JSON.stringify(this.knowledgeGraphData));
                this.knowledgeGraph.changeData(this.knowledgeGraphData);
            } catch (error) {
                console.error('获取知识图谱数据时出错：', error);
                this.knowledgeGraphData = { nodes: [], edges: [] };
                this.knowledgeGraph.changeData(this.knowledgeGraphData);
            }
        },
        initKnowledgeGraph() {
            const knowledgeGraph = new G6.Graph({
                container: "knowledge-graph",
                layout: {
                    type: 'random',
                    preventOverlap: true,
                    gpuEnabled: true,
                    workerEnabled: true,
                    linkDistance: 50,
                    preventOverlapPadding: 10
                },
                defaultNode: {
                    size: [100, 100],
                    style: {
                        fill: "#87CEEB",
                        stroke: "#0F52BA"
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
                        stroke: "#F6BD16",
                        lineWidth: 2
                    },
                    labelCfg: {
                        autoRotate: true
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
            });

            // 初始化时使用当前 knowledgeGraphData
            knowledgeGraph.data(this.knowledgeGraphData);
            knowledgeGraph.render();

            // 事件监听器保持不变
            knowledgeGraph.on("node:click", e => {
                const nodeItem = e.item;
                this.currentClickNodeKnowledge = {
                    graph: "knowledge",
                    id: nodeItem.getModel().id
                };
            });
            knowledgeGraph.on("node:mouseenter", ev => {
                const nodeItem = ev.item;
                knowledgeGraph.setItemState(nodeItem, "highlight", true);
                const connectedEdges = nodeItem.getEdges();
                connectedEdges.forEach(edge => {
                    const sourceNode = edge.getSource();
                    const targetNode = edge.getTarget();
                    const neighborNode = sourceNode === nodeItem ? targetNode : sourceNode;
                    knowledgeGraph.setItemState(neighborNode, "highlight", true);
                });
            });
            knowledgeGraph.on("node:mouseleave", ev => {
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
            this.knowledgeGraphData = {
                nodes: [],
                edges: []
            };

            if (type === 'all') {
                this.fetchKnowledgeGraphData();
            } else {
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
        showRelationDialog() {
            if (this.currentClickNodeKnowledge) {
                this.relationForm.entity1 = JSON.stringify(this.currentClickNodeKnowledge);
                this.relationDialogVisible = true;
            } else {
                this.$message.error("请先选择知识图谱中的节点！");
            }
        },
        addRelation() {
            this.relationDialogVisible = false;
            this.$message.success("成功添加关联关系！");
        },
        showAddEntityDialog() {
            this.fetchKnowledgeGraphData();
            this.$message.info("添加实体功能暂未实现！");
        },
        showEditEntityDialog() {
            this.$message.info("修改实体功能暂未实现！");
        },
        beforeDestroy() {
            if (this.knowledgeGraph) {
                this.knowledgeGraph.destroy();
            }
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
    position: relative; /* 为条件渲染的提示提供定位上下文 */
}

.graph-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 80vh;
}

.box-card {
    margin: 10px;
    flex: 1;
}

.graph {
    height: 100%;
}

.empty-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 20px;
    color: #999;
    font-size: 16px;
}

.el-tag {
    white-space: nowrap;
    overflow: visible;
    text-overflow: ellipsis;
}

.el-tag .el-tag__close {
    text-overflow: clip;
}
</style>
