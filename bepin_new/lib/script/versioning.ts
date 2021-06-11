declare var docsVersion: string;

interface IVersionsData {
    versions: string[];
    latestVersion: string;
}

namespace Versioning {
    function compareVersions(a: string, b: string) {
        const pad = (v: number[]) => {
            if (v.length < 3) {
                const to = 3 - v.length;
                for (let i = 0; i < to; i++) {
                    v.push(0);
                }
            }
            return v;
        };
        const verA = pad(a.split(".").map(v => Number.parseInt(v)));
        const verB = pad(b.split(".").map(v => Number.parseInt(v)));

        for (let i = 0; i < 3; i++) {
            const va = verA[i];
            const vb = verB[i];
            if (va < vb) {
                return 1;
            }
        }

        return -1;
    }

    export async function init() {
        let data: IVersionsData;
        try {
            const result = await fetch("/versions.json");
            data = await result.json() as IVersionsData;
        } catch (e) {
            return;
        }
        
        const versionPickerDiv = document.getElementById("version-picker");
        if (!versionPickerDiv) {
            return;
        }

        const selectEl = document.createElement("select");

        data.versions = data.versions.sort((a, b) => {
            if (a == "master") {
                return -1;
            }
            if (b == "master") {
                return 1;
            }
            return compareVersions(a, b);
        });

        for (const ver of data.versions) {
            
        }

        console.log(data);
    }
}