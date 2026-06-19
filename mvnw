#!/bin/sh
set -e

MVN_VERSION="3.9.9"
MVN_DIR="$HOME/.m2/wrapper/dists"
MVN_HOME="$MVN_DIR/apache-maven-$MVN_VERSION"

if [ ! -d "$MVN_HOME" ]; then
    echo "Downloading Maven $MVN_VERSION..."
    mkdir -p "$MVN_DIR"
    cd "$MVN_DIR"
    if command -v curl > /dev/null 2>&1; then
        curl -sL "https://repo1.maven.org/maven2/org/apache/maven/apache-maven/$MVN_VERSION/apache-maven-$MVN_VERSION-bin.zip" -o "maven.zip"
    else
        wget -q "https://repo1.maven.org/maven2/org/apache/maven/apache-maven/$MVN_VERSION/apache-maven-$MVN_VERSION-bin.zip" -O "maven.zip"
    fi
    unzip -q maven.zip && rm maven.zip
    echo "Maven $MVN_VERSION downloaded to $MVN_HOME"
    cd - > /dev/null
fi

exec "$MVN_HOME/bin/mvn" "$@"
