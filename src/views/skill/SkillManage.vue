<template>
    <div>
        <el-header>
            <el-switch v-model="switchValue"></el-switch>
            <el-input v-model="inputValue"></el-input>
            <el-button @click="showRelationDialog">关联实体</el-button>
            <el-button @click="showAddEntityDialog">添加实体</el-button>
            <el-button @click="showEditEntityDialog">修改实体</el-button>

            <div class="job-input">
                <Select v-model="selectedJobId" placeholder="请选择Job" @change="handleJobChange"
                    style="width: 200px; font-size: 18px;">
                    <Option v-for="job in jobs" :key="job.jobId" :value="job.value">{{ job.label }}</Option>
                </Select>
            </div>
        </el-header>

        <div class="graph-container">

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>技能图谱</span>
                    <el-tag v-for="(count, type) in nodeTypeCounts" :key="type" @click="filterNodeType(type)"
                        style="cursor: pointer; margin-left: 10px;">
                        {{ `${type}(${count})` }}
                    </el-tag>
                    <el-tag :key="'all'" @click="filterNodeType('all')" style="cursor: pointer; margin-left: 10px;">
                        {{ `所有类型(${allNodeTypesCount})` }}
                    </el-tag>
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
import { fetchAllJobs } from '@/api/Jobmanage';
import { Message } from "view-design";


const SKILLANDSHIP = `MATCH (n:Skill)-[r]->(m:Skill) RETURN n, r, m LIMIT 100`;

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
            selectedJobName: '',
            selectedJobId: 80, // 存储当前选中的 jobId
            jobs: [],
            // knowledgeGraph: null,
            skillGraph: null
        };
    },
    created() {
    //    this.fetchJobs();
    },
    async mounted() {
        await this.fetchJobs()
        this.initSkillGraph(); // 初始化技能图谱
        await this.fetchSkillGraphData();
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
                        console.log(this.jobs[0].value);
                        this.selectedJobId = this.jobs[0].value;
                        this.selectedJobName = this.jobs[0].label;
                    } else {
                        Message.error('Failed to fetch jobs: Invalid data format');
                    }
                })
                .catch(error => {
                    Message.error('Failed to fetch jobs');
                });
        },
        handleJobChange(jobId) {
            console.log(jobId);
            this.selectedJobId = jobId;
            this.fetchSkillGraphData();
        },
        showChildNodes(node) {
            const nodeId = node.abilityNo;

            // 找到所有子节点
            const childNodes = this.allNodes.filter(n => n.upabilityId === nodeId);
            const childNodeIds = childNodes.map(n => n.id);

            // 找到所有相关的边，确保边的源节点和目标节点都在当前节点列表中
            const childEdges = this.allEdges.filter(edge =>
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
        }
        ,

        collapseChildNodes(node) {
            const nodeId = node.abilityNo;

            // 找到所有子节点
            const childNodes = this.skillGraphData.nodes.filter(n => n.upabilityId === nodeId);
            const childNodeIds = childNodes.map(n => n.id);

            // 移除子节点及其相关的边
            this.skillGraphData.nodes = this.skillGraphData.nodes.filter(n => n.upabilityId !== nodeId);
            this.skillGraphData.edges = this.skillGraphData.edges.filter(edge =>
                !childNodeIds.includes(edge.source) && !childNodeIds.includes(edge.target)
            );

            // 更新图表数据
            this.skillGraph.changeData(this.skillGraphData);

            // 更新节点的展开状态
            this.$set(this.expandedNodes, node.id, false);
        },
        async fetchSkillGraphData() {
            let cypherQuery = `MATCH (n:Skill)-[r]->(m:Skill) RETURN n, r, m LIMIT 100`; // 默认查询
            console.log(this.selectedJobId)
            // 如果提供了 参数，修改查询语句以包含 jobId 条件
            if (this.selectedJobId) {
                cypherQuery = `MATCH (n:Skill {jobId: ${this.selectedJobId}})-[r]->(m:Skill) RETURN n, r, m`;
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
                    label: rel.type,
                }));
                // 只展示顶层节点
                let nodes = allNodes.filter(node => node.level === 1);
                let nodeIds = nodes.map(node => node.id);
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
                                label: 'HAS_CHILD'
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
                    nodes,
                    edges
                };
                console.log(this.skillGraphData)
                this.skillGraph.changeData(this.skillGraphData);
            } catch (error) {
                console.error('获取技能图谱数据时出错：', error);
            }
        },


        updateGraph() {
            if (this.skillGraph) {
                this.skillGraph.changeData(this.skillGraphData);
            }
        },
        filterNodeType(type) {
            // Clear the graph data
            this.skillGraphData = {
                nodes: [],
                edges: []
            };

            // If 'all' is selected, fetch all data
            if (type === 'all') {
                this.fetchSkillGraphData();
            } else {
                // Otherwise, fetch data for the specific node type
                let cypherQuery = `MATCH (n:${type}) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m`;
                kgBuilderApi.getCypherResult(cypherQuery).then(res => {
                    let nodes = res.data.node.map(node => ({
                        id: node.uuid,
                        label: node.skillNm,
                        ...node
                    }));
                    let edges = res.data.relationship.map(rel => ({
                        source: rel.sourceId,
                        target: rel.targetId,
                        label: rel.type,
                        uuid: rel.uuid
                    }));
                    this.skillGraphData = {
                        nodes,
                        edges
                    };
                    this.skillGraph.changeData(this.skillGraphData);
                });
            }
        },

        initSkillGraph() {
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
            const skillGraph = new G6.Graph({
                container: "skill-graph",
                layout: {
                    type: "fruchterman",
                    preventOverlap: true,
                    workerEnabled: true, // 启用 Web Worker
                    gpuEnabled: true,
                    linkDistance: 100, // 增加这个值可以使节点间距离更大
                    preventOverlapPadding: 30 // 增加这个值可以使节点间距离更大
                },
                defaultNode: {
                    size: [50, 50],
                    style: {
                        fill: "#9EC9FF",
                        stroke: "#5B8FF9"
                    },
                    labelCfg: {
                        style: {
                            fill: "#000",
                            fontSize: 10
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
        showRelationDialog() {
            if (this.currentClickNodeSkill) {
                // this.relationForm.entity1 = JSON.stringify(this.currentClickNodeKnowledge);
                this.relationForm.entity2 = JSON.stringify(this.currentClickNodeSkill);
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
            // this.fetchKnowledgeGraphData();
            this.fetchSkillGraphData();
            this.$message.info("添加实体功能暂未实现！");
        },
        // Method to show edit entity dialog
        showEditEntityDialog() {
            // Logic to show edit entity dialog
            this.$message.info("修改实体功能暂未实现！");
        },
        beforeDestroy() {
            // Destroy the knowledge graph and skill graph instances
            // if (this.knowledgeGraph) {
            //     this.knowledgeGraph.destroy();
            // }
            if (this.skillGraph) {
                this.skillGraph.destroy();
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
