import 'chai/register-expect.js';
import { describe, it } from 'mocha';
import { BuilderImpl } from '../../out/builders/BuilderImpl.js';
import { ObjectDataSource } from '../../out/dataSources/ObjectDataSource.js';
import { spy, mock } from 'sinon';
import { assert } from 'chai';

describe('BuilderImpl', () => {
    describe('build', () => {
        it("Should merge all data sources together.", async () => {
            // Arrange.
            const dataSources = [
                { id1: 'a', value1: 'value-a' },
                { id2: 'b', value2: 'value-b' },
                { id3: 'c', value3: 'value-c' },
            ];
            const builder = new BuilderImpl();
            dataSources.forEach(ds => builder.add(new ObjectDataSource(ds)));

            // Act.
            const result = await builder.build();

            // Assert.
            expect(result).to.deep.equal({
                id1: 'a',
                value1: 'value-a',
                id2: 'b',
                value2: 'value-b',
                id3: 'c',
                value3: 'value-c'
            });
        });
        it("Should run every post-merge function in the correct order.", async () => {
            // Arrange.
            const builder = new BuilderImpl();
            const spyCount = spy();
            builder.postMerge(config => {
                spyCount(config);
                expect(spyCount.callCount).to.equal(1);
                return { ...config, additional: "value" };
            });
            builder.postMerge(config => {
                spyCount(config);
                expect(spyCount.callCount).to.equal(2);
                return { ...config, test: "test" };
            });
            builder.postMerge(config => {
                spyCount(config);
                expect(spyCount.callCount).to.equal(3);
                return { ...config, additional: "value modified" };
            });

            // Act.
            const result = await builder.build();

            // Assert.
            expect(result).to.deep.equal({
                additional: 'value modified',
                test: 'test'
            });
        });
        it("Should trigger URL-building function creation when required.", async () => {
            // Arrange.
            const builder = new BuilderImpl();
            builder.add(new ObjectDataSource({
                api: {
                    rootPath: '/',
                }
            }));
            builder.createUrlFunctions('api');

            // Act.
            const result = await builder.build();

            // Assert.
            expect(result.api.buildUrl).to.be.a('function');
        });
        it("Should add tracing data when requested.", async () => {
            // Arrange.
            const builder = new BuilderImpl();
            const dataSource = new ObjectDataSource({
                api: {
                    rootPath: '/',
                }
            });
            builder.add(dataSource);

            // Act.
            const result = await builder.build(true);

            // Assert.
            expect(result._qualifiedDs).to.be.an('array');
            expect(result._trace).to.be.an('object');
        });
    });
});
