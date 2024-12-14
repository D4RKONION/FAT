import styles from "../../style/components/FrameMeter.module.scss";

const FrameMeter = () => {
  const test = {
    startup: 5,
    active: 2,
    recovery: 12,
  };

  return (
    <div className={styles.FrameMeter}>
      {Object.keys(test).map(moveStage => 
        [...Array(test[moveStage])].map((moveFrame, index) => 
          <div
            key={`${moveStage}-${index}`}
            className={`${styles[moveStage]} ${styles.FrameBlock}`}
          >
            {test[moveStage] -1 === index
              ? index + 1 : ""
            }
          </div>
        )
      )}
    </div>
  );
};

export default FrameMeter;