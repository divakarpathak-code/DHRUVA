import json


def convert_plan_to_tasks(plan_text):

    try:
        plan_json = json.loads(plan_text)

        tasks = []

        for day in plan_json["days"]:

            day_number = day["day"]

            for task in day["tasks"]:

                tasks.append({
                    "day": day_number,
                    "task": task,
                    "completed": False
                })

        return tasks

    except Exception as e:
        print("Error parsing AI response:", e)
        return []