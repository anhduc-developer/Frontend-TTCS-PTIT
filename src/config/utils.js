export const colorMethod = (method) => {
    switch (method) {
        case "POST":
            return "green";
        case "PUT":
            return "orange";
        case "DELETE":
            return "red";
        case "GET":
            return "blue";
        default:
            return "gray";
    }
};

export const groupByPermission = (permissions = []) => {
    const result = [];

    permissions.forEach((p) => {
        const exist = result.find((x) => x.module === p.module);

        if (exist) {
            exist.permissions.push(p);
        } else {
            result.push({
                module: p.module,
                permissions: [p],
            });
        }
    });

    return result;
};