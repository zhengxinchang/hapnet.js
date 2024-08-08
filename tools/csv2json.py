import csv
import json
import sys


def parse_tree_csv_to_json(csv_file_path):
    nodes = []
    edges = []
    node_ids = set()

    with open(csv_file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # 添加节点
            if row['node'] not in node_ids:
                nodes.append({
                    "id": row['node'],
                    "name": row['new_label'],
                    "radius": 0.1,
                    "values": [
                        {
                            "number": 100,
                            "category": row['host']
                        }
                    ],
                    "meta": {
                        "panel": {},
                        "hover": {

                        }


                    }})
                node_ids.add(row['node'])

            # 添加边
            try:
                dis = float(row['branch.length'])
            except:
                dis = 0.001

            edges.append({
                "source": row['parent'],
                "target": row['node'],
                "distance": dis,
                "meta": {
                    "panel": {},
                    "hover": {
                        "distance": dis
                    }
                }
            })

    # 创建最终的JSON结构
    tree_json = {
        "nodes": nodes,
        "edges": edges
    }

    return json.dumps(tree_json, indent=2)


# 使用函数
csv_file_path = sys.argv[1]  # 请替换为您的CSV文件路径
json_output = parse_tree_csv_to_json(csv_file_path)

# 打印或保存JSON输出
print(json_output)

# 如果您想将结果保存到文件
# with open('output.json', 'w') as json_file:
#     json_file.write(json_output)
