declare var docsVersion: string;

interface IVersion {
    version: string;
    tag: string;
}

interface IVersionsData {
    versions: IVersion[];
    latestTag: string;
}

namespace Versioning {
    const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

    function parseSemVer(ver: string) {
        const match = ver.match(semverPattern);
        if (match) {
            return {
                major: parseInt(match[1]),
                minor: parseInt(match[2]),
                patch: parseInt(match[3]),
                prerelease: match[4],
                build: match[5]
            };
        }
        return null;
    }

    function compareVersions(a: string, b: string) {
        const verA = parseSemVer(a);
        const verB = parseSemVer(b);

        if (!verA || !verB) {
            return 0;
        }
        if (a == b) {
            return 0;
        }
        const mainA = [verA.major, verA.minor, verA.patch];
        const mainB = [verB.major, verB.minor, verB.patch];
        for (let i = 0; i < 3; i++) {
            if (mainA[i] < mainB[i]) {
                return -1;
            }
            if (mainA[i] > mainB[i]) {
                return 1;
            }
        }
        if (verA.prerelease && !verB.prerelease) {
            return -1;
        }
        if (verA.prerelease && verB.prerelease) {
            const comparePrerelease = (partsA: string[], partsB: string[]) => {
                const len = Math.min(partsA.length, partsB.length);
                let state = 0;
                for (let i = 0; i < len; i++) {
                    const partA = partsA[i];
                    const partB = partsB[i];
                    const partAInt = parseInt(partA);
                    const partBInt = parseInt(partB);
    
                    if (!isNaN(partAInt) && isNaN(partBInt)) {
                        return -1;
                    } else if (!isNaN(partAInt) && !isNaN(partBInt)) {
                        state = partAInt - partBInt;
                        if (partAInt != partBInt) {
                            return state;
                        }
                    } else if (isNaN(partAInt) && isNaN(partBInt)) {
                        state = partA.localeCompare(partB);
                        if (partA != partB) {
                            return state;
                        }
                    }
                }
                if (state != 0) {
                    return state;
                }
                if (partsA.length < partsB.length) {
                    return -1;
                }
                return 1;
            };

            return comparePrerelease(verA.prerelease.split('.'), verB.prerelease.split('.'));
        }

        return 1;
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
            if (a.tag == "master") {
                return -1;
            }
            if (b.tag == "master") {
                return 1;
            }
            return -compareVersions(a.version, b.version);
        });

        const semVers = data.versions.map(v => ({v: v, semVer: parseSemVer(v.version)}));
        
        const specialVersions = semVers.filter(v => !v.semVer).map(v => v.v);
        const prereleaseVersions = semVers.filter(v => v.semVer && v.semVer.prerelease).map(v => v.v);
        const stableVersions = semVers.filter(v => v.semVer && !v.semVer.prerelease).map(v => v.v);

        const addOpts = (versions: IVersion[], name: (v: IVersion) => string, addDivider: boolean) => {
            for (const ver of versions) {
                const verOpt = document.createElement("option");
                verOpt.value = ver.tag;
                verOpt.textContent = name(ver);
                selectEl.appendChild(verOpt);
            }

            if (addDivider && versions.length > 0) {
                const divider = document.createElement("option");
                divider.disabled = true;
                divider.textContent = "──────────";
                selectEl.appendChild(divider);
            }
        };

        addOpts(specialVersions, v => v.version, true);
        addOpts(prereleaseVersions, v => v.version, true);
        addOpts(stableVersions, v => v.version + (v.tag == data.latestTag ? " (latest)" : ""), false);

        selectEl.value = docsVersion;
        versionPickerDiv.appendChild(selectEl);

        selectEl.addEventListener("change", () => {
            const tag = selectEl.value;
            window.location.href = `/${tag}`;
        });

        const messages = document.getElementById("global-messages");

        if (!messages) {
            return;
        }

        if (docsVersion == "master") {
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message");
            msgDiv.innerHTML = `<span>You are viewing documentation for a yet unreleased BepInEx version.</span> <a href="/">View latest stable docs (${data.latestTag}).</a>`;
            msgDiv.style.backgroundColor = "#CA8423";
            messages.appendChild(msgDiv);
        }
        else if (prereleaseVersions.some(v => v.tag == docsVersion)) {
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message");
            msgDiv.innerHTML = `<span>You are viewing documentation for a prerelease BepInEx version.</span> <a href="/">View latest stable docs (${data.latestTag}).</a>`;
            msgDiv.style.backgroundColor = "#CA8423";
            messages.appendChild(msgDiv); 
        }
        else if (docsVersion != data.latestTag) {
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message");
            msgDiv.innerHTML = `<span>You are viewing old documentation.</span> <a href="/">View latest stable docs (${data.latestTag}).</a>`;
            msgDiv.style.backgroundColor = "#CA3423";
            messages.appendChild(msgDiv);
        }
    }
}