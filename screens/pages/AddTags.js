import React, { PureComponent, createRef } from 'react';
import {
    Dimensions,
    Keyboard,
    Platform,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    View,
    Text,
    Animated,
    Easing,
    StyleSheet,
    Pressable
} from 'react-native';

import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import CATEGORIES from '../../assets/data/categories';
import LitterCategories from './components/LitterCategories';
import LitterImage from './components/LitterImage';
import LitterPickerWheels from './components/LitterPickerWheels';
import LitterTags from './components/LitterTags';
import LitterBottomSearch from './components/LitterBottomSearch';
import TagsActionButton from './components/TagsActionButton';
import { SubTitle, Colors, Body } from '../components';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

import LITTERKEYS from '../../assets/data/litterkeys';
import Icon from 'react-native-vector-icons/Ionicons';

class AddTags extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            categoryAnimation: new Animated.Value(0),
            sheetAnmiation: new Animated.Value(0),
            isCategoriesVisible: false,
            isKeyboardOpen: false,
            isOverlayDisplayed: false
        };
        this.actionsheetRef = createRef();
    }

    /**
     */
    async componentDidMount() {
        this.keyboardDidShowSubscription = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                this.setState({ isKeyboardOpen: true });
            }
        );
        this.keyboardDidHideSubscription = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                this.setState({ isKeyboardOpen: false });
            }
        );
    }

    /**
     * Cancel event listeners
     */
    componentWillUnmount() {
        this.keyboardDidShowSubscription.remove();
        this.keyboardDidHideSubscription.remove();
    }

    /**
     * Add tag on a specific image
     */
    addTag() {
        const tag = {
            category: this.props.category.title.toString(),
            title: this.props.item.toString(),
            quantity: this.props.q
        };

        // currentGlobalIndex
        const currentIndex = this.props.swiperIndex;
        this.props.addTagToImage({
            tag,
            currentIndex,
            quantityChanged: this.props.quantityChanged
        });

        this.props.changeQuantiyStatus(false);
    }

    /**
     * fn for start animation on add tags floating button click
     * animates categories from top
     * and Tags sheet with search box from bottom
     */
    startAnimation = () => {
        Animated.timing(this.state.categoryAnimation, {
            toValue: 200,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.elastic(1)
        }).start();
        Animated.timing(this.state.sheetAnmiation, {
            toValue: -400,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.elastic(1)
        }).start();
    };

    /**
     * Fn for close animation
     * happen on backdrop click
     */
    returnAnimation = () => {
        Animated.timing(this.state.categoryAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.elastic(1)
        }).start(() => {
            this.setState({
                isCategoriesVisible: false
            });
        });
        Animated.timing(this.state.sheetAnmiation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.elastic(1)
        }).start();
    };
    /**
     * The LitterPicker component
     */
    render() {
        const { lang, swiperIndex } = this.props;

        const categoryAnimatedStyle = {
            transform: [{ translateY: this.state.categoryAnimation }]
        };
        const sheetAnimatedStyle = {
            transform: [{ translateY: this.state.sheetAnmiation }]
        };

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    <StatusBar hidden />

                    <Swiper
                        showsButtons
                        nextButton={
                            <View style={styles.slideButtonStyle}>
                                <Icon
                                    name="ios-chevron-forward"
                                    color={Colors.accent}
                                    size={32}
                                />
                            </View>
                        }
                        prevButton={
                            <View style={styles.slideButtonStyle}>
                                <Icon
                                    name="ios-chevron-back"
                                    color={Colors.accent}
                                    size={32}
                                />
                            </View>
                        }
                        style={{ zIndex: 20 }}
                        index={swiperIndex}
                        loop={false}
                        loadMinimal
                        loadMinimalSize={2}
                        showsPagination={false}
                        keyboardShouldPersistTaps="handled"
                        ref="imageSwiper"
                        onIndexChanged={index =>
                            this.swiperIndexChanged(index)
                        }>
                        {this._renderLitterImage()}
                    </Swiper>
                    {/* First - Top Bar position: 'absolute'  */}
                    {this.state.isCategoriesVisible && (
                        <Animated.View
                            style={[
                                {
                                    position: 'absolute',
                                    top: -150,
                                    left: 20,
                                    zIndex: 2
                                },
                                categoryAnimatedStyle
                            ]}>
                            <LitterCategories
                                categories={CATEGORIES}
                                category={this.props.category}
                                lang={this.props.lang}
                            />
                        </Animated.View>
                    )}

                    {/* Black overlay */}
                    {this.state.isOverlayDisplayed && (
                        <View
                            style={{
                                position: 'absolute',
                                flex: 1,
                                backgroundColor: 'black',
                                opacity: 0.4,
                                width: SCREEN_WIDTH,
                                height: SCREEN_HEIGHT
                            }}
                        />
                    )}
                    {/* Floating action button */}
                    <TagsActionButton
                        openTagSheet={() => {
                            if (this.state.isCategoriesVisible) {
                                this.returnAnimation();
                            } else {
                                this.startAnimation();
                                this.setState({
                                    isCategoriesVisible: true
                                });
                            }
                        }}
                        toggleOverlay={() => {
                            this.setState(previousState => ({
                                isOverlayDisplayed: !previousState.isOverlayDisplayed
                            }));
                        }}
                    />

                    {/* Bottom action sheet with Tags picker and add tags section */}
                    {this.state.isCategoriesVisible && (
                        <Animated.View
                            style={[
                                {
                                    backgroundColor: 'white',
                                    position: 'absolute',
                                    bottom: -400,
                                    left: 0,
                                    paddingVertical: 20,
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8
                                },
                                sheetAnimatedStyle
                            ]}>
                            <View
                                style={{
                                    // height: 200,
                                    maxWidth: SCREEN_WIDTH
                                }}>
                                <LitterTags
                                    tags={
                                        this.props.images[
                                            this.props.swiperIndex
                                        ]?.tags
                                    }
                                    lang={this.props.lang}
                                    swiperIndex={this.props.swiperIndex}
                                />

                                <LitterBottomSearch
                                    suggestedTags={this.props.suggestedTags}
                                    // height={this.state.height}
                                    lang={this.props.lang}
                                    swiperIndex={this.props.swiperIndex}
                                    isKeyboardOpen={this.state.isKeyboardOpen}
                                />
                                {!this.state.isKeyboardOpen && (
                                    <LitterPickerWheels
                                        item={this.props.item}
                                        items={this.props.items}
                                        model={this.props.model}
                                        category={this.props.category}
                                        lang={this.props.lang}
                                    />
                                )}
                                {!this.state.isKeyboardOpen && (
                                    <Pressable
                                        onPress={() => this.addTag()}
                                        style={styles.buttonStyle}>
                                        <SubTitle color="white">
                                            ADD TAG
                                        </SubTitle>
                                    </Pressable>
                                )}
                            </View>
                        </Animated.View>
                    )}
                </View>
            </View>
        );
    }

    /**
     * The user has swiped left or right across an array of all photo types.
     *
     * This function gives us the new index the user has swiped to.
    
     */
    swiperIndexChanged = newGlobalIndex => {
        // Without this, we get "cannot update a component from within the function body of another component"
        setTimeout(() => {
            // litter.js swiperIndex
            this.props.swiperIndexChanged(newGlobalIndex);
        }, 0);
    };

    /**
     * Array of images to swipe through
     */

    _renderLitterImage = () => {
        // Return an array of all photos
        return this.props.images.map((image, index) => {
            return (
                <LitterImage
                    category={this.props.category}
                    lang={this.props.lang}
                    key={image.id}
                    photoSelected={image}
                    swiperIndex={this.props.swiperIndex}
                    toggleFn={() => {
                        if (this.state.isCategoriesVisible) {
                            this.returnAnimation();
                        }
                    }}
                />
            );
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: SCREEN_HEIGHT * 0.05,
        backgroundColor: 'white'
    },
    innerTagsContainer: {
        // backgroundColor: 'red',
        height: SCREEN_HEIGHT * 0.08,
        // paddingLeft: SCREEN_WIDTH * 0.05,
        // marginRight: SCREEN_WIDTH * 0.05,
        // marginBottom: - SCREEN_HEIGHT * 0.02,
        width: SCREEN_WIDTH
    },
    biggerContainer: {
        alignItems: 'center',
        // backgroundColor: 'blue',
        flexDirection: 'row',
        height: SCREEN_HEIGHT * 0.15,
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.63
        // marginTop: SCREEN_HEIGHT * 0.66,
    },
    // biggerBottomContainer: {
    //   backgroundColor: 'yellow',
    //   position: 'absolute',
    //   bottom: 0,
    //   height: SCREEN_HEIGHT * 0.2
    // },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        height: SCREEN_HEIGHT * 0.2
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.08,
        marginTop: SCREEN_HEIGHT * 0.05
    },
    iButtonsContainer: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.07,
        marginTop: SCREEN_HEIGHT * 0.08
    },
    addTagButtonInner: {
        flexDirection: 'row',
        marginTop: 'auto',
        marginBottom: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addTagButtonOuter: {
        backgroundColor: '#e67e22',
        flex: 0.7,
        zIndex: 1,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 5
    },
    hide: {
        display: 'none'
    },
    hideArrowContainer: {
        backgroundColor: 'red',
        height: SCREEN_HEIGHT * 0.05,
        flex: 0.15
    },
    modalOuter: {
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        flex: 1
    },
    // modalInner: {
    //     backgroundColor: 'white',
    //     padding: 50,
    //     borderRadius: 6
    // },
    modalTaggedText: {
        alignSelf: 'center',
        fontSize: SCREEN_HEIGHT * 0.02,
        paddingTop: SCREEN_HEIGHT * 0.02,
        paddingBottom: SCREEN_HEIGHT * 0.02,
        fontWeight: '600'
    },
    pickerWheelsContainer: {
        position: 'absolute',
        bottom: SCREEN_HEIGHT * 0.15
    },
    iPickerWheelsContainer: {
        position: 'absolute',
        bottom: SCREEN_HEIGHT * 0.12
    },
    tabArrowIconContainer: {
        flex: 0.15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    tabBarButtonLeft: {
        backgroundColor: '#2ecc71',
        width: SCREEN_WIDTH * 0.5,
        zIndex: 1
    },
    tabBarButtonLeftDisabled: {
        display: 'none'
    },
    tabBarButtonRightDisabled: {
        backgroundColor: '#ccc',
        // borderRadius: '50%',
        marginRight: SCREEN_WIDTH * 0.04
        // position: 'absolute',
        // right: 0,
    },
    textIconStyle: {
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: SCREEN_HEIGHT * 0.02,
        paddingLeft: SCREEN_WIDTH * 0.04
    },
    buttonStyle: {
        height: 56,
        width: SCREEN_WIDTH - 40,
        backgroundColor: Colors.accent,
        marginBottom: 40,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12
    },
    slideButtonStyle: {
        backgroundColor: '#fff',
        borderRadius: 100,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = state => {
    return {
        category: state.litter.category,
        collectionLength: state.litter.collectionLength,
        currentTotalItems: state.litter.currentTotalItems,
        displayAllTags: state.litter.displayAllTags,
        indexSelected: state.litter.indexSelected, // index of photos, gallery, web
        item: state.litter.item,
        items: state.litter.items,
        lang: state.auth.lang,
        model: state.settings.model,
        photoSelected: state.litter.photoSelected,
        photoType: state.litter.photoType,
        positions: state.litter.positions,
        presence: state.litter.presence,
        previous_tags: state.auth.user.previous_tags,
        previousTags: state.litter.previousTags,
        suggestedTags: state.litter.suggestedTags,
        swiperIndex: state.litter.swiperIndex,
        totalLitterCount: state.litter.totalLitterCount,
        tags: state.litter.tags,
        tagsModalVisible: state.litter.tagsModalVisible,
        token: state.auth.token,
        q: state.litter.q,
        quantityChanged: state.litter.quantityChanged,
        images: state.images.imagesArray
    };
};

export default connect(
    mapStateToProps,
    actions
)(AddTags);
