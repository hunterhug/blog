# -*- coding: utf-8 -*-

import os
import re


def list_files(root_dir, suffix='.wav', isall=False, iscur=False):
    file = []
    for parent, dirnames, filenames in os.walk(root_dir):
        if parent == root_dir:
            for filename in filenames:
                if filename.endswith(suffix):
                    if isall:
                        file.append(root_dir + '/' + filename)
                    else:
                        file.append(filename)
            if not iscur:
                return file
        else:
            if iscur:
                for filename in filenames:
                    if filename.endswith(suffix):
                        if isall:
                            file.append(parent + "/" + filename)
                        else:
                            file.append(filename)
            else:
                pass
    return file


if __name__ == "__main__":
    t = list_files("./", ".md", True, True)

    for i in t:
        # print(i)
        f = open(i, "rb")
        r = f.read().decode("utf-8")
        f.close()
        rr = re.findall(r"date: (\d{4}-\d{1,2}-\d{1,2})", r)
        # print(rr)
        if len(rr) == 0:
            continue

        xx = i.split("/")
        title = xx[0] + "/" + xx[1] + "/" + rr[0] + "-" + xx[2]
        # ff = open(title, "wb")
        # ff.write(r.encode("utf-8"))
        # ff.close()
        print(title)

        # os.remove(i)
